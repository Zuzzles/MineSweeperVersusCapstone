import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateGame, updateGameTiles } from "../../redux/game";
import { FaFlag, FaBomb } from "react-icons/fa6";
import './GamePage.css'

function GameBoard({ game_data, setLives, lives, gameOver, setGameOver, localGameData, setLocalGame }) { 
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isTilesLoaded, setIsTilesLoaded] = useState(false);
  const [markFlag, setMarkFlag] = useState(false);

  useEffect(() => {
    if (game_data?.length > 0 && !isTilesLoaded) {
      setLocalGame(game_data);
      setIsTilesLoaded(true);
    }
  }, [localGameData, game_data, setLocalGame, setIsTilesLoaded, isTilesLoaded])

  const tile_cases = (tile) => {
    if (tile.seen) {
      switch (tile.value) {
        case 0: 
          return (<div className = '0Cell'></div>)
        case 11:
          return (<div className = 'MCell'><FaBomb /></div>)
        default:
          return (<div className = {`${tile.value}Cell`}>{tile.value}</div>)
      }

    }
    else {
      if (tile.flag_color.length === 0) {
        return <div className = 'hidden'>{`H${tile.value}`}</div>
      } else {
        return <div className = 'hidden'><FaFlag style={{'color': `${tile.flag_color}`}}/></div>
      }
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

  const tileClick = async (tile, index) => {
    if (!tile.seen) {
      if (markFlag) {
        if (tile.value === 11) {
          if (tile.flag_color.length === 0) {
            const tempGameData = [...localGameData];
            tempGameData[index] = {
              id: tile.id,
              flag_color: '#D3D3D3',
              seen: tile.seen,
              value: tile.value,
              x_axis: tile.x_axis,
              y_axis: tile.y_axis
            }
            setLocalGame(tempGameData);
            console.log("!!! flag")
            dispatch(updateGameTiles({id, tempGameData}))
          }
        } else {
          let currLives;
          if (lives === 1) {
            setLocalGame(localGameData.map(currTile => ({
              id: currTile.id,
              flag_color: currTile.flag_color,
              seen: true,
              value: currTile.value,
              x_axis: currTile.x_axis,
              y_axis: currTile.y_axis
            })));
            currLives = 0;
            setLives(currLives);
            setGameOver(true);
            console.log("!!! no lives")
          } else {
            currLives = lives - 1
            setLives(currLives);
            console.log("!!! lose life")
          }
          dispatch(updateGame({id, currLives}))
        }
      } else {
        if (tile.value === 11) {
          if (tile.flag_color.length === 0) {
            const tempGameData = localGameData.map(currTile => ({
              id: currTile.id,
              flag_color: currTile.flag_color,
              seen: true,
              value: currTile.value,
              x_axis: currTile.x_axis,
              y_axis: currTile.y_axis
            }))
            setLocalGame(tempGameData)
            setGameOver(true);
            console.log("!!! hit mine")
            dispatch(updateGameTiles({id, tempGameData}))
          }
        }
        else {
          const seenList = [[tile, index]];
          const tempGameData = [...localGameData];
          while (seenList.length > 0) {
            const currData = seenList.pop();
            const currTile = currData[0];
            const currIndex = currData[1];
            tempGameData[currIndex] = {
              id: currTile.id,
              flag_color: currTile.flag_color,
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
          console.log("!!! tile clear")
          dispatch(updateGameTiles({id, tempGameData}))
        }
      }
    }
  }

  const flagSetClick = (e) => {
    e.preventDefault();

    setMarkFlag(!markFlag)
  }

  return(
   <div>
      {gameOver ? (
        <div>
          Game Over
        </div>
      ) : null}
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
      <button onClick={flagSetClick}>{`flagging mine: ${markFlag}`}</button>
   </div> 
  )
}

export default GameBoard;