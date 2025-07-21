
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Role, Permission, UserPermissionOverride
from app.schemas.user import User as UserSchema, UserUpdate
from app.core.rbac import has_permission
from app.core.audit_utils import log_audit_event
from typing import List

router = APIRouter()

@router.get("/admin/users/", response_model=List[UserSchema], dependencies=[Depends(has_permission("admin:read_users"))])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.desc()).offset(skip).limit(limit).all()
    return users

@router.put("/admin/users/{user_id}", response_model=UserSchema, dependencies=[Depends(has_permission("admin:update_user"))])
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username is not None:
        db_user.username = user_update.username
    if user_update.password is not None:
        db_user.hashed_password = get_password_hash(user_update.password)
    if user_update.is_active is not None:
        db_user.is_active = user_update.is_active

    db.commit()
    db.refresh(db_user)
    log_audit_event(db, db_user.id, f"User updated: {db_user.username}")
    return db_user

@router.delete("/admin/users/{user_id}", response_model=UserSchema, dependencies=[Depends(has_permission("admin:delete_user"))])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.is_active = False # Soft delete
    db.commit()
    db.refresh(db_user)
    log_audit_event(db, db_user.id, f"User soft-deleted: {db_user.username}")
    return db_user

@router.post("/admin/users/{user_id}/roles/{role_id}", response_model=UserSchema, dependencies=[Depends(has_permission("admin:assign_role"))])
def assign_role_to_user(user_id: int, role_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == role_id).first()
    if not user or not role:
        raise HTTPException(status_code=404, detail="User or Role not found")
    user.roles.append(role)
    db.commit()
    db.refresh(user)
    log_audit_event(db, user.id, f"Assigned role {role.name} to user {user.username}")
    return user

@router.post("/admin/users/{user_id}/permissions/{permission_id}/add", response_model=UserSchema, dependencies=[Depends(has_permission("admin:override_permission"))])
def add_user_permission_override(user_id: int, permission_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if not user or not permission:
        raise HTTPException(status_code=404, detail="User or Permission not found")

    # Check if override already exists
    override = db.query(UserPermissionOverride).filter(
        UserPermissionOverride.user_id == user_id,
        UserPermissionOverride.permission_id == permission_id
    ).first()

    if override:
        override.has_permission = 1
    else:
        override = UserPermissionOverride(user_id=user_id, permission_id=permission_id, has_permission=1)
        db.add(override)
    db.commit()
    db.refresh(user)
    log_audit_event(db, user.id, f"Added permission {permission.name} for user {user.username}")
    return user

@router.post("/admin/users/{user_id}/permissions/{permission_id}/revoke", response_model=UserSchema, dependencies=[Depends(has_permission("admin:override_permission"))])
def revoke_user_permission_override(user_id: int, permission_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if not user or not permission:
        raise HTTPException(status_code=404, detail="User or Permission not found")

    # Check if override already exists
    override = db.query(UserPermissionOverride).filter(
        UserPermissionOverride.user_id == user_id,
        UserPermissionOverride.permission_id == permission_id
    ).first()

    if override:
        override.has_permission = 0
    else:
        override = UserPermissionOverride(user_id=user_id, permission_id=permission_id, has_permission=0)
        db.add(override)
    db.commit()
    db.refresh(user)
    log_audit_event(db, user.id, f"Revoked permission {permission.name} for user {user.username}")
    return user
