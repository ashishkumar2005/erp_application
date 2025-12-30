from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None

async def connect_to_mongo() -> None:
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    print("✅ MongoDB connected")

async def close_mongo_connection() -> None:
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed")

def get_db() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialized")
    return db
