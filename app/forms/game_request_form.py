from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def user_exists(form, _):
    # Checking if user exists
    opponent_id = form.data['opponentID']
    user = User.query.filter(User.id == opponent_id).first()
    if not user:
        raise ValidationError('Email provided not found.')


def color_exists(form, _):
    # Checking if password matches
    color = form.data['hostColor']
    if not len(color) == 7:
        raise ValidationError('Not a valid hex color.')


class GameRequestForm(FlaskForm):
    opponentID = IntegerField('opponentID', validators=[DataRequired(), user_exists])
    hostColor = StringField('hostColor', validators=[DataRequired(), color_exists])