import { useEffect } from "react";  // useState
import { useDispatch, useSelector } from "react-redux";
import { getUsers, getFriendDetails, getRequestedFriends } from "../../redux/friend";
import FriendSearch from "./FriendSearch";

function FriendsPage() {
  const dispatch = useDispatch();
  const { users, details, requested, loading } = useSelector((store) => store.friends)

  // TODO: set up routes for accept and decline request
  // TODO: set up route for remove friend
  // TODO: css styling

  useEffect(() => {
    dispatch(getFriendDetails());
    dispatch(getUsers());
    dispatch(getRequestedFriends());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="friends-and-requests">
            <h2>Friend Requests</h2>
            <ul>
              {details?.requests.length === 0 ? (<p>No Requests</p>) : (
                details?.requests.map((request, i) => 
                  <li key={i}>
                    {request.username}
                    <button>Accept</button>
                    <button>Decline</button>
                  </li>)
              )}
            </ul>
            <h2>Friends List</h2>
            <ul>
              {details?.list.length === 0 ? (<p>No Friends</p>) : (
                details?.list.map((friend, i) => <li key={i}>
                  {friend.username}
                  <button>Remove</button>
                </li>)
              )}
            </ul>
          </div>
          <FriendSearch users={users} details={details} requested={requested}/>
        </div>
      )}
    </div>
  )
}

export default FriendsPage;