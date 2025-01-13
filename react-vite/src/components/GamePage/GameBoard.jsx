import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getGame } from "../../redux/game";
import './GamePage.css'

function GameBoard({ game_data }) {  // add id
  // const dispatch = useDispatch();
  // const { id } = useParams();
  const [localGameData, setLocalGame] = useState([]);
  const [isTilesLoaded, setIsTilesLoaded] = useState(false);

  useEffect(() => {
    if (game_data?.length > 0 && !isTilesLoaded) {
      setLocalGame(game_data);
      setIsTilesLoaded(true);
    }
  }, [localGameData, game_data, setLocalGame, setIsTilesLoaded, isTilesLoaded])

  const tile_cases = (tile, i) => {
    if (tile.seen) {
      switch (tile.value) {
        case 0: 
          return (<div className = '0Cell'></div>)
        case 11:
          return (<div className = 'MCell'>M</div>)
        default:
          return (<div className = {`${tile.value}Cell`}>{tile.value}</div>)
      }

    }
    else {
      return <div className = 'hidden'>{i}</div>
    }
  }

  const isValidTile = (x, y) => {
    if (y >= 0 || y < 10) {
      if (x >= 0 || x < 12) {
        return true
      }
    }
    return false
  }

  const tileClick = (tile, index) => {
    if (tile.value === 11) {
      // TODO: needs to update status to game data and add conditions
      console.log("loss")
    }
    else {
      const seenList = [[tile, index]]
      const tempGameData = [...localGameData]
      while (seenList.length > 0) {
        const currData = seenList.pop();
        const currTile = currData[0];
        const currIndex = currData[1];
        tempGameData[currIndex] = {
          flag_color: currTile.flag,
          seen: true,
          value: currTile.value,
          x_axis: currTile.x_axis,
          y_axis: currTile.y_axis
        }
        if (currTile.value === 0) {
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              if (isValidTile(currTile.x_axis + i, currTile.y_axis + j)) {
                const nextIndex = tempGameData.findIndex((e) => e.x_axis === currTile.x_axis + i && e.y_axis === currTile.y_axis + j);
                if (nextIndex !== -1) {
                  const nextTile = tempGameData[nextIndex];
                  if (!nextTile.seen) {
                    seenList.push([ nextTile, nextIndex ])
                  }
                }
              }
            }
          }
        }
      }
      setLocalGame(tempGameData);
    }
  }
  

  return(
   <div>
      <div className='grid'>
        {localGameData?.map((tile, index) => (
          <button 
            key={index} 
            className='gridCell' 
            onClick = {() => tileClick(tile, index)}
            style={{'gridColumn':`${tile.x_axis + 1}`, 'gridRow': `${tile.y_axis + 1}`}}
          >{tile_cases(tile, index)}</button>
        ))}
      </div>
   </div> 
  )
}

export default GameBoard;