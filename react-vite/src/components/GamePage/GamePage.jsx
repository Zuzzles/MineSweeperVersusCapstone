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
    // const intervalID = setInterval(() => {
    //   dispatch(getGame(id));
    // }, 200);
    // return () => clearInterval(intervalID);
    dispatch(getGame(id)).then(() => {
      if (game?.lives !== lives) {
        setLives(game?.lives)
      };
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
      };
      
    });
  }, [dispatch, id, lives, opponentScore, userScore]); //game was causing infinite loop

  // const tile_cases = (tile) => {
  //   switch (tile.value) {
  //     case 0: 
  //       return (<div className = '0Cell'></div>)
  //     case 11:
  //       return (<div className = 'MCell'>M</div>)
  //     default:
  //       return (<div className = {`${tile.value}Cell`}>{tile.value}</div>)
  //   }
  // }

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
      <div>
        <h3>Lives</h3>
        <p>Lose these when you place a wrong flag</p>
        {life_cases(lives)}
      </div>
      <div>
        <div>
          <p>Your Score</p>
          <div>{userScore}</div>
        </div>
        
        <div className='grid'>
          {/* {data?.map((tile, index) => (
            <div 
              key={index} 
              className='gridCell' 
              style={{'gridColumn':`${tile.x_axis + 1}`, 'gridRow': `${tile.y_axis + 1}`}}
            >{tile_cases(tile)}</div>
          ))} */}
        </div>
        <GameBoard 
        game_data={data} 
        setLives={setLives} 
        lives={lives} 
        gameOver={gameOver} 
        setGameOver={setGameOver}
        localGameData={localGameData}
        setLocalGame={setLocalGame}
        />
        <div>
          <p>Your Score</p>
          <div>{opponentScore}</div>
        </div>
      </div>
    </div> 
  )
}

export default GamePage;