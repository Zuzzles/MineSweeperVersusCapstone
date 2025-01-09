from .db import db, environment, SCHEMA

class GameRequest(db.Model):
  __tablename__ = 'game_requests'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  opponent_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  message = db.Column(db.Text)
  accepted = db.Column(db.Boolean, nullable=False)