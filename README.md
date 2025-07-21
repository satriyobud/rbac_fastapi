# FastAPI RBAC Application

This project implements a Role-Based Access Control (RBAC) system using FastAPI for the backend API and a simple HTML/CSS/JavaScript frontend. It provides a robust foundation for managing users, roles, and permissions within an application.

## Features

*   **User Management**: Create, read, update, and soft-delete users.
*   **Role Management**: Define and manage roles.
*   **Permission Management**: Define and manage granular permissions.
*   **Role-Permission Assignment**: Assign multiple permissions to roles.
*   **User-Role Assignment**: Assign roles to users.
*   **User Permission Overrides**: Grant or revoke specific permissions for individual users, overriding their role-based permissions.
*   **Authentication**: JWT-based authentication for secure API access.
*   **Audit Logging**: Basic auditing of user actions.
*   **Database Migrations**: Alembic for database schema management.

## RBAC Concept

This application implements a flexible Role-Based Access Control (RBAC) model. Here's how it works:

*   **Permissions**: These are the most granular actions a user can perform (e.g., `admin:read_users`, `permission:create`, `audit:read`).
*   **Roles**: Roles are collections of permissions. Instead of assigning permissions directly to users, you assign them to roles. This simplifies management, as users inherit all permissions associated with their assigned roles. Examples include "Admin", "Editor", "Viewer".
*   **Users**: Users are assigned one or more roles. They gain all the permissions granted to those roles.
*   **Permission Overrides**: For exceptional cases, the system allows for direct permission overrides on a per-user basis. This means you can explicitly grant a user a permission they wouldn't normally have through their roles, or revoke a permission they would normally inherit. This provides fine-grained control when needed without creating excessive roles.

This hierarchical structure (Permissions -> Roles -> Users, with direct User-Permission Overrides) ensures a scalable and manageable access control system.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Python 3.9+**: Download from [python.org](https://www.python.org/downloads/).
*   **pip**: Python's package installer (usually comes with Python).
*   **MySQL or PostgreSQL**: The project is configured to use a relational database. You'll need a running instance of MySQL or PostgreSQL. Make sure you have the database credentials ready.

## Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd fastapi_rbac
    ```

2.  **Create a virtual environment** (recommended):
    ```bash
    python3 -m venv venv
    ```

3.  **Activate the virtual environment:**
    *   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
    *   **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure Environment Variables:**
    Create a `.env` file in the project root directory (`fastapi_rbac/`) and add your database connection string and JWT secret key. Replace the placeholders with your actual database credentials and a strong secret key.

    ```dotenv
    DATABASE_URL="mysql+mysqlconnector://user:password@host:port/database_name"
    # Or for PostgreSQL:
    # DATABASE_URL="postgresql://user:password@host:port/database_name"
    SECRET_KEY="your_super_secret_jwt_key"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

    **Note**: For `SECRET_KEY`, generate a strong random string. You can use Python to generate one:
    ```python
    import secrets
    print(secrets.token_hex(32))
    ```

## Database Setup and Migration

This project uses Alembic for database migrations.

1.  **Initialize Alembic (if not already initialized):**
    This step is usually done once when the project is first set up. If `alembic.ini` and the `migrations/` directory already exist, you can skip this.
    ```bash
    alembic init migrations
    ```

2.  **Generate a new migration (if you make changes to `app/db/models.py`):**
    ```bash
    alembic revision --autogenerate -m "Add a descriptive message for your changes"
    ```

3.  **Apply migrations to the database:**
    ```bash
    alembic upgrade head
    ```

## Running the Application

The project consists of a FastAPI backend and a static frontend.

1.  **Start the FastAPI Backend:**
    Make sure your virtual environment is activated.
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

2.  **Serve the Frontend:**
    The frontend is a set of static HTML, CSS, and JavaScript files located in the `front-end/` directory. You can serve these files using any static file server. A simple way is to use Python's built-in HTTP server:
    ```bash
    # From the project root directory
    cd front-end
    python -m http.server 8001
    ```
    The frontend will be available at `http://localhost:8001`.

## Project Structure

```
.
├── .env                     # Environment variables
├── alembic.ini              # Alembic configuration
├── requirements.txt         # Python dependencies
├── seed.py                  # Script to seed initial data (if exists)
├── app/
│   ├── main.py              # Main FastAPI application
│   ├── api/                 # API endpoints (admin, audit, auth, permissions, roles)
│   ├── core/                # Core logic (RBAC, security, audit utilities)
│   ├── db/                  # Database models and session setup
│   └── schemas/             # Pydantic models for request/response validation
├── front-end/
│   ├── assets/              # Images, custom JS, etc.
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   ├── vendors/             # Third-party libraries (CoreUI, Simplebar, etc.)
│   ├── _header.html         # Reusable header partial
│   ├── _sidebar.html        # Reusable sidebar partial
│   ├── _footer.html         # Reusable footer partial
│   ├── index.html           # Login page
│   ├── main_dashboard.html  # Main dashboard page
│   ├── permissions.html     # Permission management page
│   └── users.html           # User management page
└── migrations/              # Alembic migration scripts
```
