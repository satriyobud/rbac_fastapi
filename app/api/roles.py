
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Role, Permission
from app.schemas.role import RoleCreate, Role as RoleSchema
from app.core.rbac import has_permission
from typing import List

router = APIRouter()

@router.post("/roles/", response_model=RoleSchema, dependencies=[Depends(has_permission("role:create"))])
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = db.query(Role).filter(Role.name == role.name).first()
    if db_role:
        raise HTTPException(status_code=400, detail="Role name already registered")
    db_role = Role(name=role.name)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.get("/roles/", response_model=List[RoleSchema], dependencies=[Depends(has_permission("role:read"))])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = db.query(Role).order_by(Role.id.desc()).offset(skip).limit(limit).all()
    return roles

@router.post("/roles/{role_id}/permissions/{permission_id}", response_model=RoleSchema, dependencies=[Depends(has_permission("role:assign_permission"))])
def assign_permission_to_role(role_id: int, permission_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if not role or not permission:
        raise HTTPException(status_code=404, detail="Role or Permission not found")
    role.permissions.append(permission)
    db.commit()
    db.refresh(role)
    return role
