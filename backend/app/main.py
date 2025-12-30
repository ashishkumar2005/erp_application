from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId

from . import models, schemas, auth, config
from .database import get_db, connect_to_mongo, close_mongo_connection

app = FastAPI(title="EduPulse ERP API")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change later to frontend URL
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ACTIVITY LOG --------------------
async def log_activity(
    db: AsyncIOMotorDatabase,
    user_id: str,
    action: str,
    details: str,
    request: Request
):
    await db["activity_logs"].insert_one({
        "user_id": user_id,
        "action": action,
        "details": details,
        "ip_address": request.client.host if request.client else "unknown",
        "timestamp": datetime.utcnow()
    })

# -------------------- AUTH --------------------
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await db["users"].find_one({"email": form_data.username})

    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=timedelta(minutes=config.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    await log_activity(db, str(user["_id"]), "LOGIN", "User logged in", request)

    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: dict = Depends(auth.get_current_user)
):
    current_user["_id"] = str(current_user["_id"])
    return current_user

# -------------------- ADMIN USERS --------------------
@app.get("/admin/users", response_model=List[schemas.User])
async def get_all_users(
    department: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(
        auth.check_role([models.UserRole.ADMIN, models.UserRole.FACULTY])
    )
):
    query = {}
    if current_user["role"] == models.UserRole.FACULTY:
        query["role"] = models.UserRole.STUDENT
    if department:
        query["department"] = department

    users = []
    user_list = await db["users"].find(query).to_list(1000)

    for u in user_list:
        u["_id"] = str(u["_id"])
        users.append(u)

    return users

@app.post("/admin/users", response_model=schemas.User)
async def create_user(
    user_data: schemas.UserCreate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin_user: dict = Depends(auth.check_role([models.UserRole.ADMIN]))
):
    if await db["users"].find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    data = user_data.dict()
    password = data.pop("password")

    data["hashed_password"] = auth.get_password_hash(password)
    data["is_active"] = 1
    data["created_at"] = datetime.utcnow()

    res = await db["users"].insert_one(data)
    user = await db["users"].find_one({"_id": res.inserted_id})
    user["_id"] = str(user["_id"])

    await log_activity(
        db,
        str(admin_user["_id"]),
        "USER_CREATE",
        f"Created user {user_data.email}",
        request
    )

    return user

@app.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin_user: dict = Depends(auth.check_role([models.UserRole.ADMIN]))
):
    await db["users"].delete_one({"_id": ObjectId(user_id)})

    await log_activity(
        db,
        str(admin_user["_id"]),
        "USER_DELETE",
        f"Deleted user {user_id}",
        request
    )

    return {"message": "User deleted successfully"}

# -------------------- STARTUP / SHUTDOWN --------------------
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"status": "EduPulse backend is running"}
