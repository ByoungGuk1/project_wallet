from app.database.session import Base, engine


def create_tables():
    Base.metadata.create_all(bind=engine)
