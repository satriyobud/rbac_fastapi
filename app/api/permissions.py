
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Permission
from app.schemas.permission import PermissionCreate, Permission as PermissionSchema
from app.core.rbac import has_permission
from typing import List

router = APIRouter()

@router.post("/permissions/", response_model=PermissionSchema, dependencies=[Depends(has_permission("permission:create"))])
def create_permission(permission: PermissionCreate, db: Session = Depends(get_db)):
    db_permission = db.query(Permission).filter(Permission.name == permission.name).first()
    if db_permission:
        raise HTTPException(status_code=400, detail="Permission name already registered")
    db_permission = Permission(name=permission.name)
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

@router.get("/permissions/", response_model=List[PermissionSchema], dependencies=[Depends(has_permission("permission:read"))])
def read_permissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    permissions = db.query(Permission).order_by(Permission.id.desc()).offset(skip).limit(limit).all()
    return permissions
