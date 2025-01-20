import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRequestTo, getActive, cancelRequest } from "../../redux/game";

// TODO on load game decline gets set needs fix
// TODO fix navigate to game

function WaitingRoom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { game, requestTo, loading } = useSelector((store) => store.game)
  const [declined, setDeclined] = useState(false)
  // const [set]
  
  useEffect(() => {
    const intervalID = setInterval(() => {
      dispatch(getRequestTo()).then(() => dispatch(getActive()))
        .then(() => {
          if (game) {
            navigate(`/game/${game.id}`)
          }
          if (!(requestTo || loading)) {
            setDeclined(true);
            clearInterval(intervalID);
          }
        });
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