
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, admin, roles, permissions, audit, dashboard
from app.core.rbac import has_permission

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8001",
    "http://127.0.0.1",
    "http://127.0.0.1:8001", # Explicitly allow 127.0.0.1
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(permissions.router)
app.include_router(admin.router)
app.include_router(audit.router, tags=["audit"], prefix="/api")
app.include_router(dashboard.router, tags=["dashboard"], prefix="/api")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the FastAPI RBAC API"}

@app.get("/reports/sensitive_data", dependencies=[Depends(has_permission("report:read"))], tags=["Reports"])
async def get_sensitive_reports():
    return {"message": "This is sensitive report data, accessible only with 'report:read' permission."}
