from flask import Blueprint, jsonify

from ..models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/users')
def list_users():
    """Return a list of registered users."""
    users = User.query.all()
    return jsonify([
        {'id': user.id, 'username': user.username}
        for user in users
    ])
