// import { useModal } from "../../context/Modal";

function FriendRequestModal({ username, friendID }) {
  // const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // send request
    // close Modal
  }

  return (
    <div>
      <h2>{`Send Friend Request to ${username}?`}</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit">Send Request</button>
      </form>
    </div>
  )
}

export default FriendRequestModal