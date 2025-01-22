from flask import Blueprint, request
from flask_wtf.csrf import validate_csrf
from app.models import User, Friend, db
from app.forms import LoginForm
from app.forms import SignUpForm, EditUserForm
from sqlalchemy import or_
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)

# TODO add the contingency for active game delete user 

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            wins = 0,
            losses = 0,
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return form.errors, 401

@auth_routes.route('/user/<int:id>/edit', methods=['PUT'])
@login_required
def edit_user(id):
    """
    Edit user
    """
    if current_user.id == id:
        user = User.query.get(id)
        form = EditUserForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            user.username=form.data['username']
            user.email=form.data['email']
            db.session.commit()
            return user.to_dict()
        return form.errors, 401
    
    else: 
        return {'error': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/user/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_user(id):
    """
    Delete user
    """
    if current_user.id == id:
        try:
            csrf_token = request.cookies.get('csrf_token')
            try:
                validate_csrf(csrf_token)
            except:
                return {'error': 'CSRF token is invalid'}, 400
            
            user = User.query.get(id)
            friends = Friend.query.filter(or_(Friend.user_id == id, Friend.friend_id == id)).all()

            logout_user()

            for friend in friends:
                db.session.delete(friend)
            db.session.delete(user)
            db.session.commit()

            return {'message': 'user deleted'}
        
        except Exception as e:
            return {'error': str(e)}, 500

    else:
        return {'error': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401