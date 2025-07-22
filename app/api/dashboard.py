
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Permission
from app.core.rbac import has_permission

router = APIRouter()

@router.get("/dashboard/total-users", response_model=dict, dependencies=[Depends(has_permission("admin:read_users"))])
def get_total_users(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    return {"total_users": total_users}

@router.get("/dashboard/total-permissions", response_model=dict, dependencies=[Depends(has_permission("permission:read"))])
def get_total_permissions(db: Session = Depends(get_db)):
    total_permissions = db.query(Permission).count()
    return {"total_permissions": total_permissions}
