from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # DATABASE
    DATABASE_URL: str

    # CLOUDINARY
    CLOUD_NAME: str
    API_KEY: str
    API_SECRET: str
    
    USER_POOL_ID: str
    CLIENT_ID: str
    COGNITO_REGION: str

settings = Settings()