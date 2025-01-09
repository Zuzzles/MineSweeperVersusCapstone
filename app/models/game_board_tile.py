from .db import db, environment, SCHEMA

class GameBoardTile(db.Model):
  __tablename__ = 'game_board_tiles'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  game_data_id = db.Column(db.Integer, db.ForeignKey('game_data.id'), nullable=False)
  value = db.Column(db.Integer, nullable=False)
  flag_color = db.Column(db.String, nullable=False)
  seen = db.Column(db.Boolean, nullable=False)
  x_axis = db.Column(db.Integer, nullable=False)
  y_axis = db.Column(db.Integer, nullable=False)