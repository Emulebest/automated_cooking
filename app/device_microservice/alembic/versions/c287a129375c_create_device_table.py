"""create device table

Revision ID: c287a129375c
Revises: 
Create Date: 2019-05-08 10:25:47.850750

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c287a129375c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'devices',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('description', sa.String(200)),
    )


def downgrade():
    op.drop_table('devices')
