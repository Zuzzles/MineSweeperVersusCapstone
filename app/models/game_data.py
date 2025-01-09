from .db import db, environment, SCHEMA

class GameData(db.Model):
  __tablename__ = 'game_data'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
  host_score = db.Column(db.Integer, nullable=False)
  opponent_score = db.Column(db.Integer, nullable=False)
  host_color = db.Column(db.String, nullable=False)
  opponent_color = db.Column(db.String, nullable=False)
  timer = db.Column(db.Integer, nullable=False)