from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance
# This instance will be shared across the application

db = SQLAlchemy()

class User(db.Model):
    """Simple user model storing a username."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self) -> str:
        return f"<User {self.username}>"
