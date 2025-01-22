// import { useEffect } from "react";
import { useSelector } from "react-redux";  // removed useDispatch
// import { Link } from "react-router-dom"
import OpenModalButton from '../OpenModalButton';
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import './UserPage.css'

// TODO add in edit user and delete user, don't let them if it's demo
// TODO add css for buttons
// TODO add change password space

function ChallengesPage() {
  // const dispatch = useDispatch();
  const { user } = useSelector((store) => store.session)

  return (
    <div className='user-page'>
      <h1>User Page</h1>
      <div>
        <p>Username: {user?.username}</p>
        <p>Email: {user?.email}</p>
      </div>
      <div className="button-box">
       <OpenModalButton modalComponent={<EditUserModal user={user}/>} buttonText='Edit User'/>
       <OpenModalButton modalComponent={<DeleteUserModal user={user}/>} buttonText='Delete User'/>
      </div>
    </div>
  )
}

export default ChallengesPage;