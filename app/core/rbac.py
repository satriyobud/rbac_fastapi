
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User, Role, Permission, UserPermissionOverride
from app.api.auth import get_current_active_user # Import the actual function
from typing import Generator

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_permissions(user: User, db: Session) -> set[str]:
    permissions = set()

    # Permissions from role
    if user.roles:
        for role in user.roles:
            for permission in role.permissions:
                permissions.add(permission.name)

    # User-specific overrides
    overrides = db.query(UserPermissionOverride).filter(UserPermissionOverride.user_id == user.id).all()
    for override in overrides:
        permission_name = db.query(Permission).filter(Permission.id == override.permission_id).first().name
        if override.has_permission == 1:  # Add permission
            permissions.add(permission_name)
        elif override.has_permission == 0:  # Revoke permission
            if permission_name in permissions:
                permissions.remove(permission_name)
    return permissions

def has_permission(permission_name: str):
    def permission_checker(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
        user_permissions = get_user_permissions(current_user, db)
        if permission_name not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User does not have permission: {permission_name}"
            )
        return True
    return permission_checker


