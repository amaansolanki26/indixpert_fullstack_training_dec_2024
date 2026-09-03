from sqlalchemy import Column, Integer, String
from app.core.database import Base

class MainUserRegistration(Base):
    __tablename__ = "MAIN_USER_REGISTRATION"
    __table_args__ = {"schema": "TRAINING_TEAM3"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    email = Column(String)
    contact = Column(String)
    state = Column(String)
    city = Column(String)