from .db import db, environment, SCHEMA

class Game(db.Model):
  __tablename__ = 'games'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  game_data_id = db.Column(db.Integer, db.ForeignKey('game_data.id'), nullable=False)
  host_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  opponent_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  host_color = db.Column(db.String, nullable=False)
  opponent_color = db.Column(db.String, nullable=False)
  status = db.Column(db.String, nullable=False) # initiated, accepted, current