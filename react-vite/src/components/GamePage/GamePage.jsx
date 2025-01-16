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
  // const { user } = useSelector((store) => store.session)
  const { game, data } = useSelector((store) => store.game) // init, game,
  const [lives, setLives] = useState(3);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  useEffect(() => {
    // const intervalID = setInterval(() => {
    //   dispatch(getGame(id));
    // }, 200);
    // return () => clearInterval(intervalID);
    dispatch(getGame(id));
    setUserScore(game?.host_score);
    setOpponentScore(game?.opponentScore);
  }, [dispatch, id, game]);

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
        <GameBoard game_data={data} id={id} setLives={setLives} lives={lives}/>
        <div>
          <p>Your Score</p>
          <div>{opponentScore}</div>
        </div>
      </div>
    </div> 
  )
}

export default GamePage;