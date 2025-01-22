import { useEffect } from "react";  // useState
import { useDispatch, useSelector } from "react-redux";
import { getUsers, getFriendDetails, getRequestedFriends, acceptFriendRequest, declineFriendRequest } from "../../redux/friend";
// import FriendRequestModal from "../Search/FriendRequestModal";
import SearchComponent from "../Search/SearchComponent";
import './FriendPage.css'

function FriendsPage() {
  const dispatch = useDispatch();
  const { users, details, requested, loading } = useSelector((store) => store.friends)

  // TODO: set up route for remove friend
  // TODO: css styling

  useEffect(() => {
    dispatch(getFriendDetails());
    dispatch(getUsers());
    dispatch(getRequestedFriends());
  }, [dispatch]);

  const handleAccept = async (id) => {

    const serverResponse = await dispatch(acceptFriendRequest(id));

    if (serverResponse.type === "friends/acceptFriendRequest/rejected") {
      // could set some errors?
    } else {
      dispatch(getFriendDetails());
    }
  }

  const handleDecline = async (id) => {
    id.preventDefault();

    const serverResponse = await dispatch(declineFriendRequest(id));

    if (serverResponse.type === "friends/declineFriendRequest/rejected") {
      // could set some errors?
    } else {
      dispatch(getFriendDetails());
    }
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="friends-page">
          <div className="friends-and-requests">
            <h2>Friend Requests</h2>
            <ul>
              {details?.requests.length === 0 ? (<p>No Requests</p>) : (
                details?.requests?.map((request, i) => 
                  <li key={i} className='request-list-item'>
                    {request.username}
                    <div className="button-box">
                      <button onClick={() => handleAccept(request.id)}>Accept</button>
                      <button onClick={() => handleDecline(request.id)}>Decline</button>
                    </div>
                  </li>)
              )}
            </ul>
            <h2>Friends List</h2>
            <ul>
              {details?.list.length === 0 ? (<p>No Friends</p>) : (
                details?.list.map((friend, i) => <li className='friend-list-item' key={i}>
                {friend.username}
                {/* <button>Remove</button> */}
              </li>)
              )}
            </ul>
          </div>
          <SearchComponent data={users?.filter(
            i => !(details?.list.map(friend => friend.username))?.includes(i.username)
          ).filter(
            i => !(details?.requests.map(friend => friend.username))?.includes(i.username)
          ).filter(
            i => !(requested?.map(friend => friend.username))?.includes(i.username)
          )} friend={true} />
        </div>
      )}
    </div>
  )
}

export default FriendsPage;