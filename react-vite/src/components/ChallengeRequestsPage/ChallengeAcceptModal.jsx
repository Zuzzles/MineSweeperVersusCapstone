import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../redux/game";
import { useModal } from "../../context/Modal";

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
  const [errors, setErrors] = useState();
  const { closeModal } = useModal(); 
  const colors = ['#4D9DE0', '#E15554', '#E1BC29', '#3BB273', '#7768AE']


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // const opponentID = user.id

    // const serverResponse = await dispatch(
    //   createRequest({
    //     opponentID,
    //     hostColor
    //   })
    // )
    // if (serverResponse.type === "session/login/rejected") {
    //   setErrors(serverResponse);
    // } else {
    //   closeModal();
    //   navigate('/waiting');
    // }
  }

  return (
    <div>
      <h2>{`Accept Challenge from ${request?.host_name}?`}</h2>
      <form onSubmit={handleSubmit}>
        <label>
        Choose Color
        {colors.map((color, i) => (
          color === request.host_color ? null : (
            <input key={i} 
            onChange={(e) => setHostColor(e.target.value)}
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