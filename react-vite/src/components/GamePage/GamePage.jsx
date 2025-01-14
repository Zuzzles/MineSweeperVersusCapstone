import { useEffect } from "react";  // useState
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGame } from "../../redux/game";
import GameBoard from "./GameBoard";
import './GamePage.css'

function GamePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { game, data } = useSelector((store) => store.game)
  
  useEffect(() => {
    dispatch(getGame(id));
  }, [dispatch, id])

  const tile_cases = (tile) => {
    switch (tile.value) {
      case 0: 
        return (<div className = '0Cell'></div>)
      case 11:
        return (<div className = 'MCell'>M</div>)
      default:
        return (<div className = {`${tile.value}Cell`}>{tile.value}</div>)
    }
  }

  const life_cases = (lives) => {
    switch (lives) {
      case 3:
        return (<div>L L L</div>)
      case 2:
        return (<div>X L L</div>)
      case 1:
        return (<div>X X L</div>)
      case 0:
        return (<div>X X X</div>)
    }
  }

  return(
    <div>
      <div>
        <h3>Lives</h3>
        <p>Lose these when you place a wrong flag</p>
        {life_cases(game?.lives)}
      </div>
      <div>
        <div>
          User Score
        </div>
        <div className='grid'>
          {data?.map((tile, index) => (
            <div 
              key={index} 
              className='gridCell' 
              style={{'gridColumn':`${tile.x_axis + 1}`, 'gridRow': `${tile.y_axis + 1}`}}
            >{tile_cases(tile)}</div>
          ))}
        </div>
        <div>Spacer</div>
        <GameBoard game_data={data} id={id} />
        <div>
          Other Score
        </div>
      </div>
    </div> 
  )
}

export default GamePage;