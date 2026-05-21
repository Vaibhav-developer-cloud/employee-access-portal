from pydantic import BaseModel


class LoginSchema(BaseModel):
    user_id: str
    password: str