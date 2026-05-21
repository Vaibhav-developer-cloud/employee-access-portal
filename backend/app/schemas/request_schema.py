from pydantic import BaseModel
from typing import Optional


class RequestCreateSchema(BaseModel):
    request_title: str
    access_type: str
    reason: str
    priority: str
    employee_name: str


class AdminActionSchema(BaseModel):
    status: str
    admin_remark: Optional[str] = None