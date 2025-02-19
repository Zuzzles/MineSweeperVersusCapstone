from flask import Blueprint, request
from flask_login import current_user, login_required
from flask_wtf.csrf import validate_csrf
from app.models import GameRequest, Game, GameData, GameBoardTile, User, db
from app.forms import GameRequestForm, GameForm
from sqlalchemy import or_, and_
import random
import math

# TODO check out local versus of render

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
        or_(
          Game.host_id == current_user.id, Game.opponent_id == current_user.id
        ), GameData.status == 0
      )).first()
      if game_data:
        return {'game_request': 'You have an active game, either play or cancel game.'}, 401
      if GameRequest.query.filter(and_(
        GameRequest.host_id == current_user.id,
        GameRequest.accepted == False,
        GameRequest.declined == False
      )).first():
        return {'game_request': 'You have already requested a game, cancel your request to issue a new one.'}, 401
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
      active_game = db.session.query(
        Game,
        GameData
      ).join(GameData, GameData.id == Game.id).filter(
        or_(current_user.id == Game.host_id, current_user.id == Game.opponent_id)
      ).filter(
        GameData.status == 0
      ).first()
      
      return {'game': active_game[0].to_dict()}

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

@game_routes.route('/update/<int:id>/tiles', methods = ['PUT'])
def update_game_tiles(id):
  """
  Update game data
  """
  unassigned_flag = "#D3D3D3"
  # helper function to set win
  def _set_win(tot_flag):
    if tot_flag == 15:
      if game_data[0][1].host_score > game_data[0][1].opponent_score:
        game_data[0][1].status = 1
      else:
        game_data[0][1].status = 2

  if current_user.is_authenticated:
    try:
      with db.session.no_autoflush: 
        csrf_token = request.cookies.get('csrf_token')
        try:
          validate_csrf(csrf_token)
        except:
          return {'error': 'CSRF token is invalid'}, 400

        game_data = db.session.query(
          Game,
          GameData,
          GameBoardTile
        ).join(GameData, GameData.id == Game.id).join(
          GameBoardTile, GameBoardTile.game_data_id == GameData.id
        ).filter(Game.id == id).all()

        tiles = request.json['tempGameData']
        # print("!!!flag_color unass", unassigned_flag)
        total_flags = 0

        if current_user.id == game_data[0][0].host_id:
          user_color = game_data[0][0].host_color
          for tile in tiles:
            # print("!!!tile", tile)
            for (_, _, game_tile) in game_data:
              # index = tile in game_data where x = x and y = y
              if game_tile.x_axis == tile['x_axis'] and game_tile.y_axis == tile['y_axis']:
                # print("!!!backend tile", game_tile)
                # If the existing tile is already seen/flagged skip it
                if tile['flag_color'] != "" and tile['value'] == 11:
                  total_flags += 1
                if not game_tile.seen and game_tile.flag_color == "":
                  if game_tile.value != 11:
                    game_tile.seen = tile['seen']
                  elif tile['seen'] == True:
                    game_tile.seen = tile['seen']
                    game_data[0][1].status = 2
                  if tile['flag_color'] == unassigned_flag:
                    game_tile.flag_color = user_color
                    game_data[0][1].host_score = game_data[0][1].host_score + 1
          _set_win(total_flags)
          db.session.commit()
          return {
            'game': game_data[0][1].to_dict_host(), 
            'game_tiles': [tile[2].to_dict() for tile in game_data]
          }
        else:
          user_color = game_data[0][0].opponent_color
          # print("!!!", user_color)
          for tile in tiles:
            print("!!!tile", tile)
            for (_, _, game_tile) in game_data:
              # index = tile in game_data where x = x and y = y
              if game_tile.x_axis == tile['x_axis'] and game_tile.y_axis == tile['y_axis']:
                # If the existing tile is already seen/flagged skip it
                if tile['flag_color'] != "" and tile['value'] == 11:
                  total_flags += 1
                if not game_tile.seen and game_tile.flag_color == "":
                  if game_tile.value != 11:
                    game_tile.seen = tile['seen']
                  elif tile['seen'] == True:
                    game_tile.seen = tile['seen']
                    game_data[0][1].status = 1
                  if tile['flag_color'] == unassigned_flag:
                    game_tile.flag_color = user_color
                    game_data[0][1].opponent_score = game_data[0][1].opponent_score + 1
          _set_win(total_flags)
          db.session.commit()
          # print('!!!!', total_flags)
          return {
            'game': game_data[0][1].to_dict_opponent(), 
            'game_tiles': [tile[2].to_dict() for tile in game_data]
          }

    except Exception as e:
      return {'error': str(e)}, 500
    
  else:
    return {'error': 'Unauthorized'}, 401

@game_routes.route('/update/<int:id>', methods = ['PUT'])
def update_game(id):
  """
  Update game data
  """
  #TODO add in win/lose user update in here
  def tiles_seen():
    game_data = db.session.query(
      Game,
      GameBoardTile
    ).join(
      GameBoardTile, GameBoardTile.game_data_id == Game.id
    ).filter(Game.id == id).all()

    for tile in game_data:
      tile[1].seen = True

  if current_user.is_authenticated:
    try:
      csrf_token = request.cookies.get('csrf_token')
      try:
        validate_csrf(csrf_token)
      except:
        return {'error': 'CSRF token is invalid'}, 400

      game_data = db.session.query(
        Game,
        GameData
      ).join(
        GameData, GameData.id == Game.id
      ).filter(Game.id == id).first()

      lives = request.json['currLives']
      # print("!!!!", game_data)
      # print('!!!', lives)

      if int(lives) in range(0, 4):
        if current_user.id == game_data[0].host_id:
          game_data[1].host_lives = lives
          if lives == 0:
            game_data[1].status = 2
            tiles_seen()
          db.session.commit()
          return {'game': game_data[1].to_dict_host()}
        elif current_user.id == game_data[0].opponent_id:
          game_data[1].opponent_lives = lives
          if lives == 0:
            game_data[1].status = 1
            tiles_seen()
          db.session.commit()
          return {'game': game_data[1].to_dict_host()}
        else:
          return {'error': 'Unauthorized for this game'}, 401
      else:
        return {'error': 'Invalid number of lives'}, 401

    except Exception as e:
      return {'error': str(e)}, 500
    
  else:
    return {'error': 'Unauthorized'}, 401
  
@game_routes.route('/delete/<int:id>', methods=['DELETE'])
def delete_full_game(id):
  """
  delete game fully
  """
  try:
    csrf_token = request.cookies.get('csrf_token')
    try:
      validate_csrf(csrf_token)
    except:
      return {'error': 'CSRF token is invalid'}, 400

    game_info = db.session.query(
        Game,
        GameData,
        GameBoardTile
      ).join(GameData, GameData.id == Game.id).join(
        GameBoardTile, GameBoardTile.game_data_id == GameData.id
      ).filter(Game.id == id).all()
    
    if not game_info:
      return {'error': 'request not found'}, 404
    
    for (_, _, game_tile) in game_info:
      db.session.delete(game_tile)
    db.session.delete(game_info[0][1])
    db.session.delete(game_info[0][0])
    db.session.commit()

    return {'message': "Request deleted successfully"}, 200
  
  except Exception as e:
    return {'error': str(e)}, 500