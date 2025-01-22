from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from app.models import User, Friend, db
from sqlalchemy import func

user_routes = Blueprint('users', __name__)

@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries without friend requests and friends
    """
    users = User.query.order_by(func.lower(User.username)).filter(User.id != current_user.id).all()
    print("!!!", users)
    return {'users': [user.to_dict_list() for user in users]}

@user_routes.route('/friends')
@login_required
def user_friends():
    """
    Get users friend list
    """
    if current_user.is_authenticated:
        try:
            friends_list = db.session.query(
                Friend,
                User
            ).join(
                User, User.id == Friend.friend_id
            ).filter(Friend.user_id == current_user.id).filter(
                Friend.accepted == True
            ).order_by(func.lower(User.username)).all()

            friend_requests = db.session.query(
                Friend,
                User
            ).join(
                User, User.id == Friend.user_id
            ).filter(Friend.friend_id == current_user.id).filter(
                Friend.accepted == False
            ).all()

            return {
                'list': [{
                    'id': friend[1].id,
                    'username': friend[1].username
                } for friend in friends_list],
                'requests': [{
                    'id': friend[1].id,
                    'username': friend[1].username
                } for friend in friend_requests]
            }
        
        except Exception as e:
            return {'error': str(e)}, 500
    
    else:
        return {'error': {'message': 'Unauthorized'}}, 401
    
@user_routes.route('/requested_friends')
@login_required
def user_requested_friends():
    """
    Get users requested friend list
    """
    if current_user.is_authenticated:
        try:
            friends_list = db.session.query(
                Friend,
                User
            ).join(
                User, User.id == Friend.friend_id
            ).filter(Friend.user_id == current_user.id).filter(
                Friend.accepted == False
            ).all()

            return {
                'requestedFriends': [{
                    'id': friend[1].id,
                    'username': friend[1].username
                } for friend in friends_list]
            }
        
        except Exception as e:
            return {'error': str(e)}, 500
    
    else:
        return {'error': {'message': 'Unauthorized'}}, 401
    
@user_routes.route('/friend/request/create/<int:id>')
@login_required
def create_friend_request(id):
    """
    Create friend request
    """
    if current_user.is_authenticated:
        try:
            friend = Friend.query.filter(
                current_user.id == Friend.user_id
            ).filter(
                Friend.friend_id == id
            ).first()
            if friend:
                return {'error': 'already friends or requested with this person'}, 500
            
            request = Friend(
                user_id = current_user.id,
                friend_id = id,
                accepted = False
            )
            db.session.add(request)
            db.session.commit()

            return {
                'message': 'request sent'
            }

        except Exception as e:
            return {'error': str(e)}, 500
    
    else:
        return {'error': {'message': 'Unauthorized'}}, 401
    
@user_routes.route('/friend/request/<int:id>/accept')
@login_required
def accept_friend_request(id):
    """
    Create friend request
    """
    if current_user.is_authenticated:
        try:
            friend = Friend.query.filter(current_user.id == Friend.friend_id).filter(
                id == Friend.user_id
            ).first()
            if not friend:
                return {'error': 'no request/friend found'}, 500
            
            if friend.accepted:
                return {'error': 'already friends'}, 500
            
            friend.accepted = True
            new_friend = Friend(
                user_id = friend.friend_id,
                friend_id = friend.user_id,
                accepted = True
            )

            db.session.add(new_friend)
            db.session.commit()

            return {
                'message': 'request accepted'
            }

        except Exception as e:
            return {'error': str(e)}, 500
    
    else:
        return {'error': {'message': 'Unauthorized'}}, 401
    
@user_routes.route('/friend/request/<int:id>/decline')
@login_required
def decline_friend_request(id):
    """
    Create friend request
    """
    if current_user.is_authenticated:
        try:
            friend = Friend.query.filter(current_user.id == Friend.friend_id).filter(
                id == Friend.user_id
            ).first()
            if not friend:
                return {'error': 'no request/friend found'}, 500
            
            if friend.accepted:
                return {'error': 'already friends'}, 500

            db.session.delete(friend)
            db.session.commit()

            return {
                'message': 'request accepted'
            }

        except Exception as e:
            return {'error': str(e)}, 500
    
    else:
        return {'error': {'message': 'Unauthorized'}}, 401

@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()
