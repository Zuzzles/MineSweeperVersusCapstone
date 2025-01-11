import { useEffect} from "react";  // useState
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGame } from "../../redux/game";
import GameBoard from "./GameBoard";
import './GamePage.css'

function GamePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const game_data = useSelector((store) => store.game.data)
  
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

  return(
   <div>
      <div className='grid'>
        {game_data?.map((tile, index) => (
          <div 
            key={index} 
            className='gridCell' 
            style={{'gridColumn':`${tile.x_axis + 1}`, 'gridRow': `${tile.y_axis + 1}`}}
          >{tile_cases(tile)}</div>
        ))}
      </div>
      <div>Spacer</div>
      <GameBoard game_data={game_data} id={id} />
   </div> 
  )
}

export default GamePage;