from .db import db, environment, SCHEMA

class GameRequest(db.Model):
  __tablename__ = 'game_requests'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  host_id = db.Column(db.Integer, nullable=False)
  opponent_id = db.Column(db.Integer, nullable=False)
  host_color = db.Column(db.String, nullable=False)
  accepted = db.Column(db.Boolean, nullable=False)
  declined = db.Column(db.Column, nullable=False)