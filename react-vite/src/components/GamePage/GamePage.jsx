import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGame } from "../../redux/game";
import { FaHeart } from "react-icons/fa6";
import GameBoard from "./GameBoard";
import './GamePage.css'

function GamePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user } = useSelector((store) => store.session)
  const { init, game, data } = useSelector((store) => store.game) // init, game,
  const [lives, setLives] = useState(3);
  const [localGameData, setLocalGame] = useState([]);
  const [userWins, setUserWins] = useState(0);    // 0 undecided, 1 true, 2 false
  const [gameOver, setGameOver] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  useEffect(() => {
    const dispatchIntervalID = setInterval(() => {
      dispatch(getGame(id)).then(() => {
        if (game?.lives !== lives) {
          setLives(game?.lives)
        }
        if (user?.id === init?.host_id) {
          if (game?.host_score !== userScore) {
            setUserScore(game?.host_score)
          }
          if (game?.opponent_score !== opponentScore) {
            setOpponentScore(game?.opponent_score)
          }
          if (game?.status !== 0) {
            setGameOver(true)
            if (game?.status === 1) setUserWins(1)
            else setUserWins(2)
            // clear interval
          }
        } else if (user?.id === init?.opponent_id) {
          if (game?.host_score !== opponentScore) {
            setUserScore(game?.opponent_score)
          }
          if (game?.opponent_score !== userScore) {
            setOpponentScore(game?.host_score)
          }
          if (game?.status !== 0) {
            setGameOver(true)
            if (game?.status === 2) setUserWins(1)
            else setUserWins(2)
            // clear interval
          }
        }
        if (!localGameData || localGameData.length === 0) setLocalGame(data)
        for (let i = 0; i < data.length; i++) {
          if (data[i].seen !== localGameData[i].seen) {
            setLocalGame(data)
            break;
          }
          if (data[i].flag_color !== localGameData[i].flag_color) {
            setLocalGame(data)
            break;
          }
        }
      });
    }, 500);
    return () => clearInterval(dispatchIntervalID);
  }, [dispatch, id, lives, opponentScore, userScore]); //game was causing infinite loop

  const life_cases = (lives) => {
    switch (lives) {
      case 3:
        return (<div>
          <FaHeart style={{'color': '#960019'}}/>
          <FaHeart style={{'color': '#960019'}}/>
          <FaHeart style={{'color': '#960019'}}/>
        </div>)
      case 2:
        return (<div>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#960019'}}/>
          <FaHeart style={{'color': '#960019'}}/>
        </div>)
      case 1:
        return (<div>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#960019'}}/>
        </div>)
      case 0:
        return (<div>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#D3D3D3'}}/>
          <FaHeart style={{'color': '#D3D3D3'}}/>
        </div>)
    }
  }

  return(
    <div>
      <div className='life-box'>
        <h3>Lives</h3>
        <p>Lose these when you place a wrong flag</p>
        {life_cases(lives)}
      </div>
      <div>
        <div>
          <p>Your Score</p>
          <div>{userScore}</div>
        </div>
        {gameOver ? (
          <div>
            Game Over
            {userWins === 0 ? null : (userWins === 1 ? (
              <h2>You Win!</h2>
            ) : (
              <h2>You Lose</h2>
            ))}{/*0 undecided, 1 true, 2 false*/}
          </div>
        ) : null}
        <GameBoard 
        setLives={setLives} 
        lives={lives}  
        setGameOver={setGameOver}
        localGameData={localGameData}
        setLocalGame={setLocalGame}
        />
        <div>
          <p>Opponent Score</p>
          <div>{opponentScore}</div>
        </div>
      </div>
    </div> 
  )
}

export default GamePage;