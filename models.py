# health_app/models.py

from . import db, login_manager
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    """User model for storing user information."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    history = db.relationship('History', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class History(db.Model):
    """History model for storing user queries and AI responses."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tool_type = db.Column(db.String(50), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<History {self.id} for user {self.user_id}>'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
