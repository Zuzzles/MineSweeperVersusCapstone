import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGame } from "../../redux/game";
import './GamePage.css'

function GamePage() {
  const dispatch = useDispatch();
  const game_data = useSelector((store) => store.game.data)
  const [local_game_data, set_local_game] = useState([])
  
  useEffect(() => {
    dispatch(createGame())
    set_local_
  }, [dispatch, createGame])

  const tile_cases = (tile) => {
    if (tile.seen) {

    }
  }

  return(
   <div>
      <div className='grid'>
        {game_data?.game_tiles.map((tile) => (
          <div style={{'gridColumn':`${tile.x_axis + 1}`, 'gridRow': `${tile.y_axis + 1}`}}>{tile.value}</div>
        ))}
      </div>
   </div> 
  )
}

export default GamePage;