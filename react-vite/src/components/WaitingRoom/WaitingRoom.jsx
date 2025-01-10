import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createGame } from "../../redux/game";

function GamePage() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(createGame())
  }, [dispatch, createGame])

  return(
   <div>
      
   </div> 
  )
}

export default GamePage;