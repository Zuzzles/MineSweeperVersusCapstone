from .db import db, environment, SCHEMA

#TODO: change status to game_data

class GameData(db.Model):
  __tablename__ = 'game_data'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  host_score = db.Column(db.Integer, nullable=False)
  opponent_score = db.Column(db.Integer, nullable=False)
  timer = db.Column(db.Integer, nullable=False)