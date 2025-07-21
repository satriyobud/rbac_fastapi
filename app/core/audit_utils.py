
from sqlalchemy.orm import Session
from app.db.models import AuditLog
from datetime import datetime

def log_audit_event(db: Session, user_id: int, action: str):
    audit_log = AuditLog(user_id=user_id, action=action, timestamp=datetime.now().isoformat())
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
