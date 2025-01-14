from .db import db, environment, SCHEMA

class Game(db.Model):
  __tablename__ = 'games'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  host_id = db.Column(db.Integer, nullable=False)
  opponent_id = db.Column(db.Integer, nullable=False)
  host_color = db.Column(db.String, nullable=False)
  opponent_color = db.Column(db.String, nullable=False)

  def to_dict(self):
    return {
      'id': self.id,
      'host_color': self.host_color,
      'opponent_color': self.opponent_color
    }
