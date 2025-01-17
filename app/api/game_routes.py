from flask import Blueprint, request
from flask_login import current_user, login_required
from flask_wtf.csrf import validate_csrf
from app.models import GameRequest, Game, GameData, GameBoardTile, User, db
from app.forms import GameRequestForm, GameForm
from sqlalchemy import or_, and_
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
# request routes
@game_routes.route('/request/issue', methods = ['POST'])
def game_request_issue():
  """
  Create and issue friend request with opponent id
  """
  if current_user.is_authenticated:
    try:
      form = GameRequestForm()
      form['csrf_token'].data = request.cookies['csrf_token']
      # print("!!!", form.data)
      game_data = db.session.query(
        Game,
        GameData
      ).filter(and_(
        Game.opponent_id == form.data['opponentID'], GameData.status == 0
      )).first()
      if game_data:
        return {'error': 'You have an active game, either play or cancel game.'}, 401
      if GameRequest.query.filter(and_(
        GameRequest.host_id == current_user.id,
        GameRequest.accepted == False,
        GameRequest.declined == False
      )).first():
        return {'error': 'You have already requested a game, cancel your request to issue a new one.'}, 401
      if form.validate_on_submit():
        game_request = GameRequest(
          host_id = current_user.id,
          opponent_id = form.data['opponentID'],
          host_color = form.data['hostColor'],
          accepted = False,
          declined = False
        )
        db.session.add(game_request)
        db.session.commit()
        return {'request': game_request.to_dict()}
      return {'error': form.errors}, 401
    except Exception as e:
      return {'error': str(e)}, 500
  
  else:
    return {'error': 'Unauthorized'}, 401

@game_routes.route('/request/get')
def get_request():
  """
  Returns requests for games
  """
  if current_user.is_authenticated:
    try:
      requests = db.session.query(GameRequest, User).join(
        GameRequest, GameRequest.host_id == User.id
      ).filter(
        GameRequest.opponent_id == current_user.id
      ).all()

      request_dicts = [request[0].to_dict() for request in requests]
      
      return {'requests': [{**request, "host_name": requests[index][1].username} for index, request in enumerate(request_dicts)]}

    except Exception as e:
      return {'error': str(e)}, 500
    
  else:
    return {'error': 'Unauthorized'}, 401  
  
@game_routes.route('/request/self')
def get_self_requests():
  """
  Returns your request
  """
  if current_user.is_authenticated:
    try:
      request = GameRequest.query.filter(GameRequest.host_id == current_user.id).first()

      return {'request': request.to_dict()}
    
    except Exception as e:
      return {'error': str(e)}, 500
    
  else:
    return {'error': 'Unauthorized'}, 401  
  
@game_routes.route('/request/delete/<int:id>', methods=['DELETE'])
def delete_request(id):
  """
  deletes request
  """
  try:
    csrf_token = request.cookies.get('csrf_token')
    try:
      validate_csrf(csrf_token)
    except:
      return {'error': 'CSRF token is invalid'}, 400

    game_request = GameRequest.query.get(id)
    if not game_request:
      return {'error': 'request not found'}, 404
    
    db.session.delete(game_request)
    db.session.commit()

    return {'message': "Request deleted successfully"}, 200
  
  except Exception as e:
    return {'error': str(e)}, 500


# game routes
@game_routes.route('/init', methods = ['POST'])
def game_init():
  """
  Initializes Game returns full info to opponent
  """

  try:
    form = GameForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
      game = Game(
        host_id = form.data['hostID'],
        opponent_id = form.data['opponentID'],
        host_color = form.data['hostColor'],
        opponent_color = form.data['opponentColor']
      )
      game_data = GameData(
        host_score = 0,
        host_lives = 3,
        opponent_score = 0,
        opponent_lives = 3,
        status = 0,
        timer = 0
      )

      db.session.add(game)
      db.session.add(game_data)
      db.session.commit()
    else:
      return {'error': form.errors}, 401
  
    game_board = MinesweeperBoard([12, 10], 15)  #[x, y], number_of_mines

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
      'game': game.to_dict(),
      'game_data': game_data.to_dict_opponent(),
      'game_tiles': [tile.to_dict() for tile in game_data_tiles]
    }
 
  except Exception as e:
    return {'error': str(e)}, 500

@game_routes.route('/active')
def get_active():
  """
  Returns game based on user ID
  """
  if current_user.is_authenticated:
    try:
      active_game = Game.query.filter(
        or_(current_user.id == Game.host_id, current_user.id == Game.opponent_id)
      ).first()
      
      return {'game': active_game.to_dict()}

    except Exception as e:
      return {'error': str(e)}, 500
  
  else:
    return {'error': 'Unauthorized'}, 401

@game_routes.route('/get/<int:id>')
def get_game(id):
  """
  Returns all game data by game id
  """

  if current_user.is_authenticated:
    try:
      game_info = db.session.query(
        Game,
        GameData,
        GameBoardTile
      ).join(GameData, GameData.id == Game.id).join(
        GameBoardTile, GameBoardTile.game_data_id == GameData.id
      ).filter(Game.id == id).all()

      if current_user.id == game_info[0][0].host_id:
        return {
          'game': game_info[0][1].to_dict_host(),
          'game_tiles': [tile[2].to_dict() for tile in game_info]
        }
      elif current_user.id == game_info[0][0].opponent_id:
        return {
          'game': game_info[0][1].to_dict_opponent(),
          'game_tiles': [tile[2].to_dict() for tile in game_info]
        }
      else:
        return {'error': 'Unauthorized'}, 401

    except Exception as e:
      return {'error': str(e)}, 500
  
  else:
    return {'error': 'Unauthorized'}, 401

@game_routes.route('/update/<int:id>', methods = ['PUT'])
def update_game(id):
  """
  Update game data
  """
  if current_user.is_authenticated:
    try:
      csrf_token = request.cookies.get('csrf_token')
      try:
        validate_csrf(csrf_token)
      except:
        return {'error': 'CSRF token is invalid'}, 400

      game = Game.query.filter(Game.id == id).first()
      game_data = db.session.query(
        GameData,
        GameBoardTile
      ).join(
        GameBoardTile, GameBoardTile.game_data_id == GameData.id
      ).filter(Game.id == id).all()

      # game: 
        # update current users lives using game
        # must be in range 0 through 3
        # if 0 set status to other user win
      
      # tile loop:
        # if flag != currFlag and currFlag == "" add user Id color
          # count flags with not "" for flag color
          # if flags total = total mines (15) set game status to whoever won
        # if seen set seen

    except Exception as e:
      return {'error': str(e)}, 500
    
  else:
    return {'error': 'Unauthorized'}, 401

#   try:
#     game_info = db.session.query(
#       GameData,
#       GameBoardTile
#     ).join(
#       GameBoardTile, GameBoardTile.game_data_id
#     )