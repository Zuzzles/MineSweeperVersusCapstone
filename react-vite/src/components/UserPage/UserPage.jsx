import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom"
import OpenModalButton from '../OpenModalButton';
import './UserPage.css'

// TODO add in edit user and delete user, don't let them if it's demo
// TODO add css for buttons

function ChallengesPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.session)

  return (
    <div className='user-page'>
      <h1>User Page</h1>
      <div>
        <p>Username: {user?.username}</p>
        <p>Email: {user?.email}</p>
      </div>
      <div className="button-box">
       <button>Edit User</button>
       <button>Remove User</button>
      </div>
    </div>
  )
}

export default ChallengesPage;