
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.models import Base, User, Role, Permission
from app.core.security import get_password_hash

def create_initial_data(db: Session):
    # Create default permissions
    permissions_to_create = [
        "role:create", "role:read", "role:assign_permission",
        "permission:create", "permission:read",
        "admin:assign_role", "admin:override_permission", "admin:read_users", "admin:update_user", "admin:delete_user",
        "audit:read",
        "report:read"
    ]

    for perm_name in permissions_to_create:
        permission = db.query(Permission).filter(Permission.name == perm_name).first()
        if not permission:
            permission = Permission(name=perm_name)
            db.add(permission)
            db.commit()
            db.refresh(permission)

    # Create admin role
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        admin_role = Role(name="admin")
        db.add(admin_role)
        db.commit()
        db.refresh(admin_role)

    # Assign all permissions to admin role
    all_permissions = db.query(Permission).all()
    for perm in all_permissions:
        if perm not in admin_role.permissions:
            admin_role.permissions.append(perm)
    db.commit()
    db.refresh(admin_role)

    # Create admin user
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        hashed_password = get_password_hash("adminpass") # Change this password in production!
        admin_user = User(username="admin", hashed_password=hashed_password)
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

    # Assign admin role to admin user
    if admin_role not in admin_user.roles:
        admin_user.roles.append(admin_role)
    db.commit()
    db.refresh(admin_user)

    print("Initial data (admin user, role, permissions) created successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        create_initial_data(db)
    finally:
        db.close()
