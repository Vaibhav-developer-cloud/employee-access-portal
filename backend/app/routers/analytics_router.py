from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.request_model import AccessRequest

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# STATUS COUNT
@router.get("/status-count")
def status_count(db: Session = Depends(get_db)):

    pending = db.query(AccessRequest).filter(
        AccessRequest.status == "PENDING"
    ).count()

    approved = db.query(AccessRequest).filter(
        AccessRequest.status == "APPROVED"
    ).count()

    rejected = db.query(AccessRequest).filter(
        AccessRequest.status == "REJECTED"
    ).count()

    return {
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }


# ACCESS TYPE DISTRIBUTION
@router.get("/access-types")
def access_types(db: Session = Depends(get_db)):

    result = db.query(
        AccessRequest.access_type,
        func.count(AccessRequest.id)
    ).group_by(
        AccessRequest.access_type
    ).all()

    data = []

    for item in result:
        data.append({
            "accessType": item[0],
            "count": item[1]
        })

    return data