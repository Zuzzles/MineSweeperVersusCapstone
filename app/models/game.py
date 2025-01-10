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
  status = db.Column(db.Integer, nullable=False) # 0 = initiated, 1 = accepted, 2 = current