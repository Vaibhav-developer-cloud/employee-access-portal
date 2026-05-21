from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class RequestTimeline(Base):

    __tablename__ = "request_timeline"

    id = Column(Integer, primary_key=True)

    request_id = Column(Integer)

    action = Column(String)

    action_by = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )