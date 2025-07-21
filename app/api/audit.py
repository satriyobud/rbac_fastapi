
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AuditLog
from app.core.rbac import has_permission
from typing import List

router = APIRouter()

@router.get("/audit_logs/", dependencies=[Depends(has_permission("audit:read"))])
def read_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    audit_logs = db.query(AuditLog).order_by(AuditLog.id.desc()).offset(skip).limit(limit).all()
    return audit_logs
