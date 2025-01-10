from .db import db, environment, SCHEMA

class GameBoardTile(db.Model):
  __tablename__ = 'game_board_tiles'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  game_data_id = db.Column(db.Integer, nullable=False)
  value = db.Column(db.Integer, nullable=False)
  flag_color = db.Column(db.String, nullable=False)
  seen = db.Column(db.Boolean, nullable=False)
  x_axis = db.Column(db.Integer, nullable=False)
  y_axis = db.Column(db.Integer, nullable=False)

  def increment_count(self):
    self.value += 1
  
  def is_mine(self):
    if self.value == 11:
      return True
    else:
      return False
    
  def to_dict(self):
    return {
      'value': self.value,
      'flag_color': self.flag_color,
      'seen': self.seen,
      'x_axis': self.x_axis,
      'y_axis': self.y_axis,
    }