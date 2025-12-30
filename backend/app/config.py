from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    MONGODB_URL: str
    DATABASE_NAME: str = "edupulse"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
