import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createGame } from "../../redux/game";

function GamePage() {
  const dispatch = useDispatch();
  const { game, loading } = useSelector((store) => store.game)
  
  useEffect(() => {
    dispatch(createGame())
  }, [dispatch])

  return(
   <div>
      {loading ? (
        <div>Loading Game</div>
      ) : (
        <div>
          Go to Game
          <Link to={`/game/${game?.id}`}>Game</Link>
        </div>
      )}
   </div> 
  )
}

export default GamePage;