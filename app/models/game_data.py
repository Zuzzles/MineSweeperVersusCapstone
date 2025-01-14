from .db import db, environment, SCHEMA

#TODO: change status to game_data

class GameData(db.Model):
  __tablename__ = 'game_data'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  host_score = db.Column(db.Integer, nullable=False)
  host_lives = db.Column(db.Integer, nullable=False)
  opponent_score = db.Column(db.Integer, nullable=False)
  opponent_lives = db.Column(db.Integer, nullable=False)
  timer = db.Column(db.Integer, nullable=False)
  status = db.Column(db.Integer, nullable=False)
    # 0 = accepted, 1 = current, 2 = host wins, 3 = opponent wins

  def to_dict_host(self):
    return {
      'id': self.id,
      'host_score': self.host_score,
      'opponent_score': self.opponent_score,
      'host_lives': self.host_lives,
      'timer': self.timer,
      'status': self.status
    }
  
  def to_dict_opponent(self):
    return {
      'id': self.id,
      'host_score': self.host_score,
      'opponent_score': self.opponent_score,
      'opponent_lives': self.opponent_lives,
      'timer': self.timer,
      'status': self.status
    }