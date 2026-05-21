from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.request_model import AccessRequest
from app.models.timeline_model import RequestTimeline

from app.schemas.request_schema import (
    RequestCreateSchema,
    AdminActionSchema
)

from app.schemas.common_schema import ResponseSchema

from app.utils.role_checker import (
    get_current_user,
    admin_required
)

router = APIRouter(
    prefix="/requests",
    tags=["Requests"]
)


# CREATE REQUEST
@router.post("/")
def create_request(
    data: RequestCreateSchema,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    new_request = AccessRequest(
        request_title=data.request_title,
        access_type=data.access_type,
        reason=data.reason,
        priority=data.priority,
        employee_name=data.employee_name
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # TIMELINE ENTRY
    timeline = RequestTimeline(
        request_id=new_request.id,
        action="REQUEST_CREATED",
        action_by=user["user_id"]
    )

    db.add(timeline)
    db.commit()

    return ResponseSchema(
        success=True,
        message="Request Created Successfully",
        data={
            "id": new_request.id,
            "request_title": new_request.request_title,
            "access_type": new_request.access_type,
            "reason": new_request.reason,
            "priority": new_request.priority,
            "status": new_request.status,
            "employee_name": new_request.employee_name,
            "created_at": new_request.created_at
        }
    )


# GET ALL REQUESTS
@router.get("/")
def get_requests(
    search: str = Query(None),
    status: str = Query(None),
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    query = db.query(AccessRequest)

    # EMPLOYEE CAN VIEW ONLY OWN REQUESTS
    if user["role"] == "EMPLOYEE":
        print("Filtering requests for employee:", user["user_id"])
        query = query.filter(
            AccessRequest.employee_name ==
            user["user_id"]
        )

    # SEARCH
    if search:

        query = query.filter(
            or_(
                AccessRequest.employee_name.ilike(f"%{search}%"),
                AccessRequest.request_title.ilike(f"%{search}%"),
                AccessRequest.access_type.ilike(f"%{search}%")
            )
        )

    # FILTER
    if status:

        query = query.filter(
            AccessRequest.status == status
        )

    query = query.order_by(AccessRequest.id.desc())
    
    # GET TOTAL COUNT BEFORE PAGINATION
    total = query.count()
    
    # PAGINATION
    skip = (page - 1) * limit
    requests = query.offset(skip).limit(limit).all()
    print("Fetched requests:", len(requests))

    request_list = []

    for req in requests:

        request_list.append({
            "id": req.id,
            "request_title": req.request_title,
            "access_type": req.access_type,
            "reason": req.reason,
            "priority": req.priority,
            "status": req.status,
            "employee_name": req.employee_name,
            "created_at": req.created_at
        })

    return ResponseSchema(
        success=True,
        message="Requests Fetched Successfully",
        data={
            "page": page,
            "limit": limit,
            "total": total,
            "requests": request_list
        }
    )


# GET SINGLE REQUEST
@router.get("/{request_id}")
def get_single_request(
    request_id: int,
    db: Session = Depends(get_db)
):

    request = db.query(
        AccessRequest
    ).filter(
        AccessRequest.id == request_id
    ).first()

    if not request:

        raise HTTPException(
            status_code=404,
            detail="Request Not Found"
        )

    return {
        "id": request.id,
        "request_title": request.request_title,
        "access_type": request.access_type,
        "reason": request.reason,
        "priority": request.priority,
        "status": request.status,
        "employee_name": request.employee_name,
        "admin_remark": request.admin_remark,
        "created_at": request.created_at
    }


# ADMIN APPROVE / REJECT
@router.put("/{request_id}")
def admin_action(
    request_id: int,
    data: AdminActionSchema,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    request = db.query(
        AccessRequest
    ).filter(
        AccessRequest.id == request_id
    ).first()

    if not request:

        raise HTTPException(
            status_code=404,
            detail="Request Not Found"
        )

    request.status = data.status
    request.admin_remark = data.admin_remark

    # TIMELINE ENTRY
    timeline = RequestTimeline(
        request_id=request.id,
        action=data.status,
        action_by=admin["user_id"]
    )

    db.add(timeline)

    db.commit()
    db.refresh(request)

    return {
        "success": True,
        "message": "Request Updated Successfully",
        "data": {
            "id": request.id,
            "status": request.status,
            "admin_remark": request.admin_remark
        }
    }


# REQUEST TIMELINE
@router.get("/{request_id}/timeline")
def get_timeline(
    request_id: int,
    db: Session = Depends(get_db)
):

    timeline = db.query(
        RequestTimeline
    ).filter(
        RequestTimeline.request_id == request_id
    ).all()

    timeline_list = []

    for item in timeline:

        timeline_list.append({
            "id": item.id,
            "request_id": item.request_id,
            "action": item.action,
            "action_by": item.action_by,
            "created_at": item.created_at
        })

    return timeline_list
