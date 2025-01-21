import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createFriendRequest, getRequestedFriends } from "../../redux/friend";
import './FriendRequestModal.css'

function FriendRequestModal({ user }) { // , friendID
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      const friendID = user.id
  
      const serverResponse = await dispatch(
        createFriendRequest(friendID)
      )
      if (serverResponse.type === "friends/createFriendRequest/rejected") {
        // setErrors(serverResponse);
      } else {
        closeModal();
        dispatch(getRequestedFriends());
      }
    }

  return (
    <div className='friend-request-mod'>
      <h2>{`Send Friend Request to ${user.username}?`}</h2>
      <button onClick={handleSubmit} type="submit">Send Request</button>
    </div>
  )
}

export default FriendRequestModal