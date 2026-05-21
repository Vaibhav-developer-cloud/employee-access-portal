# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session

# from app.database import get_db
# from app.models.request_model import AccessRequest

# router = APIRouter()


# @router.put("/requests/{request_id}/approve")
# def approve_request(
#     request_id: int,
#     db: Session = Depends(get_db)
# ):

#     request = db.query(
#         AccessRequest
#     ).filter(
#         AccessRequest.id == request_id
#     ).first()

#     request.status = "APPROVED"

#     db.commit()

#     return {
#         "message": "Request approved"
#     }




# # reject api 

# @router.put("/requests/{request_id}/reject")
# def reject_request(
#     request_id: int,
#     db: Session = Depends(get_db)
# ):

#     request = db.query(
#         AccessRequest
#     ).filter(
#         AccessRequest.id == request_id
#     ).first()

#     request.status = "REJECTED"

#     db.commit()

#     return {
#         "message": "Request rejected"
#     }