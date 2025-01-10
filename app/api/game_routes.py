from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Game, GameData, GameBoardTile, db
import random
import math

game_routes = Blueprint('games', __name__)

# Initializing minesweeper class
class MinesweeperBoard:
  def __init__(self, board_size, mine_number):
    board_positions = [i + 1 for i in range(board_size[0] * board_size[1])]
    random.shuffle(board_positions)
      
    self.board_size = board_size
    self.mine_pos = board_positions[:mine_number]


  def set_board(self, board_arr):
    for mine in self.mine_pos:
      y = math.ceil(mine/self.board_size[0]) - 1
      x = math.floor(mine - y*self.board_size[0] - 1)
      board_arr[y][x].value = 11
      for i in range(-1, 2):
        for j in range(-1, 2):
          if i != 0 or j != 0:
            if self.is_valid_tile(x + j, y + i) and not board_arr[y + i][x + j].value == 11:
              board_arr[y + i][x + j].increment_count()
      
  def is_valid_tile(self, x, y):
    if y >= 0 and y < self.board_size[1]:
      if x >= 0 and x < self.board_size[0]:
        return True
      else:
        return False
    else:
      return False

# Flattens board tiles for transfer   
def flatten_board(board_arr):
  return [tile for x_list in board_arr for tile in x_list]
      
# Routes begin here
@game_routes.route('/init')
def game_init():
  """
  Initializes Game
  """

  try:
    game = Game(
      host_id = 1,
      opponent_id = 2,
      host_color = '#F7EE7F',
      opponent_color = '#6874E8',
      status = 0
    )
    game_data = GameData(
      host_score = 0,
      opponent_score = 0,
      timer = 0
    )

    db.session.add(game)
    db.session.add(game_data)
    db.session.commit()
  
    game_board = MinesweeperBoard([12, 10], 11)  #[x, y], number_of_mines

    game_data_tiles = [[GameBoardTile(
      game_data_id = game_data.id,
      value = 0,
      flag_color = "",
      seen = False,
      x_axis = x,
      y_axis = y
    ) for x in range(game_board.board_size[0])] for y in range(game_board.board_size[1])]

    game_board.set_board(game_data_tiles)

    game_data_tiles = flatten_board(game_data_tiles)

    db.session.add_all(game_data_tiles)
    db.session.commit()

    return {
      'game': {
        'id': game.id,
        'status': game.status
      },
      'game_tiles': [tile.to_dict() for tile in game_data_tiles]
    }
 
  except Exception as e:
    print(e)
    return {'error': str(e)}, 500
  
# Update board