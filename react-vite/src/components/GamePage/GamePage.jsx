import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getGame, cancelGame } from "../../redux/game";
import { FaHeart } from "react-icons/fa6";
import GameBoard from "./GameBoard";
import './GamePage.css'



function GamePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((store) => store.session)
  const { init } = useSelector((store) => store.game) // init, game,
  const [lives, setLives] = useState(3);
  const [localGameData, setLocalGame] = useState([]);
  const [userWins, setUserWins] = useState(0);    // 0 undecided, 1 true, 2 false
  const [gameOver, setGameOver] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  useEffect(() => {
    const dispatchIntervalID = setInterval(() => {
      // console.log("!!!!", user);
      // console.log("!!!!", init);
      dispatch(getGame(id)).then((res) => {
        if (res.payload.game) {
          if (res.payload.game?.lives !== lives) {
            setLives(res.payload.game?.lives)
          }
          if (user?.id === init?.host_id) {
            // console.log("!!!!", user);
            if (res.payload.game?.host_score !== userScore) {
              setUserScore(res.payload.game?.host_score)
            }
            if (res.payload.game?.opponent_score !== opponentScore) {
              setOpponentScore(res.payload.game?.opponent_score)
            }
            if (res.payload.game?.status !== 0) {
              setGameOver(true)
              if (res.payload.game?.status === 1) setUserWins(1)
              else setUserWins(2)
              clearInterval(dispatchIntervalID);
            }
          } else if (user?.id === init?.opponent_id) {
            if (res.payload.game?.host_score !== opponentScore) {
              setOpponentScore(res.payload.game?.opponent_score)
            }
            if (res.payload.game?.opponent_score !== userScore) {
              setUserScore(res.payload.game?.opponent_score)
            }
            if (res.payload.game?.status !== 0) {
              setGameOver(true)
              if (res.payload.game?.status === 2) setUserWins(1)
              else setUserWins(2)
              clearInterval(dispatchIntervalID);
            }
          } else {
            if (res.payload.game?.status !== 0) {
              setGameOver(true)
              clearInterval(dispatchIntervalID);
            }
          }
          if (!localGameData || localGameData.length === 0) setLocalGame(res.payload.game_tiles)
          for (let i = 0; i < res.payload.game_tiles.length; i++) {
            if (res.payload.game_tiles[i]?.seen !== localGameData[i].seen) {
              setLocalGame(res.payload.game_tiles)
              break;
            }
            if (res.payload.game_tiles[i]?.flag_color !== localGameData[i].flag_color) {
              setLocalGame(res.payload.game_tiles)
              break;
            }
          }
        } else {
          clearInterval(dispatchIntervalID);
          navigate('/');
          alert('game has been cancelled');
        }
      });
    }, 200);
    return () => clearInterval(dispatchIntervalID);
  }, [dispatch, navigate, id, lives, opponentScore, userScore, user, init, localGameData]); //game was causing infinite loop

  const life_cases = (lives) => {
    switch (lives) {
      case 3:
        return (<div className="hearts">
          <FaHeart style={{'color': '#960019'}}/>
          <FaHeart style={{'color': '#960019'}}/>
          <FaHeart style={{'color': '#960019'}}/>
        </div>)
      case 2:
        return (<div className="hearts">
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#960019'}}/>
          <FaHeart style={{'color': '#960019'}}/>
        </div>)
      case 1:
        return (<div className="hearts">
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#960019'}}/>
        </div>)
      case 0:
        return (<div className="hearts">
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#D3D3D3'}}/>
        </div>)
    }
  }

  const cancelClick = (id) => {
    dispatch(cancelGame(id));
    navigate('/');
    alert('game has been cancelled/deleted');
  }

  return(
    <div className="game-page">
      <div className='life-box'>
        <h3 className="lives-title">Lives</h3>
        <p className="lives-directions">Lose these when you place a wrong flag</p>
        {life_cases(lives)}
      </div>
      <div className="game-box-div">
        {user?.id == init?.host_id ? (
          <div className="score-box">
            <div className="score-card" style={{'backgroundColor': `${init?.host_color}`}}>
              <p>Your Score</p>
              <div>{userScore}</div>
            </div>
            <div className="score-card" style={{'backgroundColor': `${init?.opponent_color}`}}>
              <p>Opponent Score</p>
              <div>{opponentScore}</div>
            </div>
          </div>
        ) : (
          <div className="score-box">
            <div className="score-card" style={{'backgroundColor': `${init?.opponent_color}`}}>
              <p>Your Score</p>
              <div>{userScore}</div>
            </div>
            <div className="score-card" style={{'backgroundColor': `${init?.host_color}`}}>
              <p>Opponent Score</p>
              <div>{opponentScore}</div>
            </div>
          </div>
        )}
        {gameOver ? (
          <div className="game-over-div">
            Game Over
            {userWins === 0 ? null : (userWins === 1 ? (
              <h2>You Win!</h2>
            ) : (
              <h2>You Lose</h2>
            ))}{/*0 undecided, 1 true, 2 false*/}
            <button onClick={() => cancelClick(id)}>Delete Game</button>
          </div>
        ) : null}
        <GameBoard 
        setLives={setLives} 
        lives={lives}  
        setGameOver={setGameOver}
        localGameData={localGameData}
        setLocalGame={setLocalGame}
        />
      </div>
      <button className='cancel-button' onClick={() => cancelClick(id)}>Cancel Game</button>
    </div> 
  )
}

export default GamePage;