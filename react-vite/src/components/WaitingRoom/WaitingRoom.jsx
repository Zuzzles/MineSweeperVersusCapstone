import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRequestTo, getActive, cancelRequest } from "../../redux/game";

// TODO fix nav in here, add in a is Loading state?

function WaitingRoom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { game, requestTo, loading } = useSelector((store) => store.game)
  const [declined, setDeclined] = useState(false)
  // const [set]
  
  useEffect(() => {
    dispatch(getRequestTo());
    const intervalID = setInterval(() => {
      dispatch(getActive());
      if (game) {
        navigate(`/game/${game.id}`)
      }
      if (!(requestTo || loading)) {
        setDeclined(true);
        clearInterval(intervalID);
      }
    }, 200);
    return () => clearInterval(intervalID);
  }, [dispatch])

  const handleClickCancel = async (e) => {
    e.preventDefault();
    dispatch(cancelRequest(requestTo.id));
    navigate('/')
  }

  const handleClickNav = async (e) => {
    e.preventDefault();
  }

  return(
    declined ? (
      <div>
        <h2>Game has been declined.</h2>
        <button onClick={handleClickNav}>Issue another challenge?</button>
      </div>
    ) : (
      <div>
        <div>
          <h2>Waiting for Response</h2>
          <p>Please do not click away.</p>
          <p>Game will start upon acceptance.</p>
        </div>
        <button onClick={handleClickCancel}>Cancel Request</button>
      </div>
    )
  )
}

export default WaitingRoom;