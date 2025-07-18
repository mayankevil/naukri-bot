from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL: str = "sqlite:///./naukri_bot.db"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    FIRST_ADMIN_USER: str = "admin"
    FIRST_ADMIN_PASSWORD: str = "adminpassword"
    FIRST_ADMIN_EMAIL: str = "admin@example.com"

settings = Settings()
