from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    is_active: bool | None = None
    password: str | None = None

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True