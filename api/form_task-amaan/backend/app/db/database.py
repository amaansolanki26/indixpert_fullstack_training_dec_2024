from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Windows Authentication (Trusted Connection) - No Password
DATABASE_URL = (
    "mssql+pyodbc:///?"
    "driver=ODBC+Driver+17+for+SQL+Server"
    "&server=localhost"
    "&database=" + os.getenv("DB_NAME", "master") +
    "&trusted_connection=yes"
    "&TrustServerCertificate=yes"
    "&Encrypt=no"
)

engine = create_engine(
    DATABASE_URL, 
    echo=False,           # Set to True for debugging
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()