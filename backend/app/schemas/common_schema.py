from pydantic import BaseModel
from typing import Any


class ResponseSchema(BaseModel):

    success: bool
    message: str
    data: Any