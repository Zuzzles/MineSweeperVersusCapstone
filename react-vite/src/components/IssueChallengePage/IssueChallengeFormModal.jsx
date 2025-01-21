import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../redux/game";
import { useModal } from "../../context/Modal";
import "./IssueChallengeModal.css";

// Colors:
//    #4D9DE0 Celestial blue
//    #E15554 Indian red
//    #E1BC29 Saffron
//    #3BB273 Jade
//    #7768AE Royal purple

//TODO: CSS styling
//TODO: fix radio input colors

function IssueFormModal({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hostColor, setHostColor] = useState("");
  // const [errors, setErrors] = useState();
  const { closeModal } = useModal(); 
  const colors = ['#4D9DE0', '#E15554', '#E1BC29', '#3BB273', '#7768AE']


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const opponentID = user.id

    const serverResponse = await dispatch(
      createRequest({
        opponentID,
        hostColor
      })
    )
    if (serverResponse.type === "session/requestIssue/rejected") {
      // setErrors(serverResponse);
    } else {
      closeModal();
      navigate('/waiting');
    }
  }

  return (
    <div className="challenge-modal">
      <h2>{`Issue Challenge to ${user?.username}?`}</h2>
      <form onSubmit={handleSubmit}>
        <label>Choose Color</label>
        <label>
        {colors.map((color, i) => (
          <input key={i} 
            onChange={(e) => setHostColor(e.target.value)}
            type="radio" 
            value={color} 
            name="colorPick" 
            style={{'accentColor': `${color}`, 'outline': `5px solid ${color}`}}
            required/>
        ))}
        </label>
        <button type="submit">Challenge</button>
      </form>
    </div>
  )
}

export default IssueFormModal