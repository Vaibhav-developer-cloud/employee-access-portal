from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base


class AccessRequest(Base):
    __tablename__ = "access_requests"

    id = Column(Integer, primary_key=True, index=True)

    request_title = Column(String)
    access_type = Column(String)
    reason = Column(Text)
    priority = Column(String)

    status = Column(String, default="PENDING")

    employee_name = Column(String)

    admin_remark = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)