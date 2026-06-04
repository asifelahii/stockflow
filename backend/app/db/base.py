from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

# Import models here so Alembic can detect them.
# More models will be added here in later phases.