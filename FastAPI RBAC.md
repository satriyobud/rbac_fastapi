# 🛠️ FastAPI RBAC Boilerplate BlueprintX

## 🔐 Dynamic Role-Based Access Control (RBAC) Blueprint

### 🎯 Purpose

This RBAC boilerplate provides a highly flexible and scalable permission system for enterprise-level applications such as POS, ERP, and form approval workflows. It enforces structured access control with default role-based permissions, while allowing fine-grained customization per user via a UI.

---

### 📌 Key Features

| Feature | Description |
| --- | --- |
| Single Role per User | Each user is assigned one role. |
| Role-based Default Permissions | Permissions are inherited from the assigned role by default. |
| Per-user Permission Customization | Admins can add or revoke specific permissions per user (via UI). |
| No Direct User Permissions | All permissions must be linked to a role; users cannot have permissions without a role. |
| API/Menu Level Protection Only | The RBAC system controls access to APIs and menus, not data-level filtering. |
| Admin UI Integration | Admins manage user access through a UI with permission checklists. |
| Preview Before Assignment | Permissions inherited from roles are pre-filled, but admins can adjust them before submission. |
| Audit Trail | All user-related actions (create, read, update) are logged for traceability. |
| Modular & Reusable | Designed as a pluggable RBAC module to be reused across systems. |

---

### 🧩 Database Schema Overview

### Tables

- **users**: stores user data
- **roles**: stores role definitions
- **permissions**: stores granular permissions (e.g., `product:create`, `form:approve`)
- **user_roles**: M-1 relation between user and role
- **role_permissions**: M-M relation between roles and permissions
- **user_permission_overrides**:
    - add: custom permission additions
    - revoke: custom permission removals

### Permission Resolution Logic

```python
effective_permissions = (
    permissions_from_role
    + permissions_added_by_admin
    - permissions_revoked_by_admin
)

```

---

### 🔐 Access Control Mechanism

Each protected endpoint uses a `has_permission(permission_name)` dependency, which checks the user's resolved permissions.

```python
@router.get("/reports", dependencies=[Depends(has_permission("report:read"))])
def get_reports():
    ...

```

---

### 👤 Admin Experience (UI Flow)

1. Admin assigns a role to the user.
2. Default permissions from the role are pre-filled in a checklist UI.
3. Admin can **add** or **revoke** specific permissions before submitting.
4. Changes are saved to `user_permission_overrides`.
5. All actions are logged in the audit log.

---

### 🔐 Example Permissions

| Permission | Description |
| --- | --- |
| `product:create` | Allows creating new products |
| `user:ban` | Allows banning users |
| `form:approve` | Allows form approvals |

---

### 🛠 Technologies

- **Backend**: Python 3.11, FastAPI
- **Database**: MySQL (via SQLAlchemy ORM)
- **Auth**: JWT-based authentication
- **Migrations**: Alembic
- **Audit Logs**: Custom table with timestamped entries