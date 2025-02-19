import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGame, cancelRequest } from "../../redux/game";
import { useModal } from "../../context/Modal";
import './ChallengeAcceptModal.css'

// Colors:
//    #4D9DE0 Celestial blue
//    #E15554 Indian red
//    #E1BC29 Saffron
//    #3BB273 Jade
//    #7768AE Royal purple

//TODO: CSS styling
//TODO: fix radio input colors

function ChallengeAcceptModal({ request }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [opponentColor, setOpponentColor] = useState("");
  // const [errors, setErrors] = useState();
  const { closeModal } = useModal(); 
  const colors = ['#4D9DE0', '#E15554', '#E1BC29', '#3BB273', '#7768AE']


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hostID = request.host_id;
    const opponentID = request.opponent_id;
    const hostColor = request.host_color;

    const serverResponse = await dispatch(
      createGame({
        hostID,
        opponentID,
        hostColor,
        opponentColor
      })
    );

    if (serverResponse.type === "game/initialize/rejected") {
      // setErrors(serverResponse);
    } else {
      closeModal();
      dispatch(cancelRequest(request.id))
      navigate(`/game/${serverResponse.payload.game.id}`);
    }
  }

  return (
    <div className="challenge-accept">
      <h2>{`Accept Challenge from ${request?.host_name}?`}</h2>
      <form onSubmit={handleSubmit}>
        <label>Choose Color</label>
        <label>
        {colors.map((color, i) => (
          color === request.host_color ? null : (
            <input key={i} 
            onChange={(e) => setOpponentColor(e.target.value)}
            type="radio" 
            value={color} 
            name="colorPick" 
            style={{'accentColor': `${color}`, 'outline': `5px solid ${color}`}}
            required/>
          )
        ))}
        </label>
        <button type="submit">Accept Challenge</button>
      </form>
    </div>
  )
}

export default ChallengeAcceptModal