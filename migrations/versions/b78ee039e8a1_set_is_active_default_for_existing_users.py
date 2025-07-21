"""Set is_active default for existing users

Revision ID: b78ee039e8a1
Revises: ba87f39838e6
Create Date: 2025-07-21 11:18:37.704617

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b78ee039e8a1'
down_revision: Union[str, Sequence[str], None] = 'ba87f39838e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE users SET is_active = TRUE WHERE is_active IS NULL")


def downgrade() -> None:
    op.execute("UPDATE users SET is_active = NULL WHERE is_active = TRUE")
