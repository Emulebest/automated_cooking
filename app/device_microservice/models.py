import sqlalchemy

from settings import engine

metadata = sqlalchemy.MetaData()

metadata.create_all(engine)

devices = sqlalchemy.Table(
    "devices",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("description", sqlalchemy.String),
    sqlalchemy.Column("status", sqlalchemy.String),
    sqlalchemy.Column("user", sqlalchemy.Integer),
    sqlalchemy.Column("connected", sqlalchemy.Boolean),
    sqlalchemy.Column("targetTemp", sqlalchemy.Float, nullable=True),
    sqlalchemy.Column("timestamp", sqlalchemy.Integer, nullable=True),
    sqlalchemy.Column("time", sqlalchemy.Integer, nullable=True)
)
