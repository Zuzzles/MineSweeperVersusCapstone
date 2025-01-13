import { useEffect, useState } from "react";  // useState
import { useDispatch, useSelector } from "react-redux";
import { getUsers, getFriendDetails } from "../../redux/friend";

function FriendsPage() {
  const dispatch = useDispatch();
  const { users, details, loading } = useSelector((store) => store.friends)
  const [userSearch, setUserSearch] = useState([]);

  useEffect(() => {
    dispatch(getFriendDetails());
    dispatch(getUsers());
  }, [dispatch])

  const handleSearch = async (e) => {
    e.preventDefault();


  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="friends-and-requests">
            <h2>Friends List</h2>
            <ul>
              {details.list.length === 0 ? (<p>No Friends</p>) : (
                details.list.map((friend, i) => <li key={i}>{friend.username}</li>)
              )}
            </ul>
            <h2>Friend Requests</h2>
            <ul>
              {details.requests.length === 0 ? (<p>No Requests</p>) : (
                details.requests.map((request, i) => 
                  <li key={i}>
                    {request.username}
                    <button>Accept</button>
                    <button>Decline</button>
                  </li>)
              )}
            </ul>
          </div>
          <div className="search-friends">
            <h2>Search Friend by Username</h2>
            <form onSubmit={handleSearch}>
              <input 
                type="search"
              />
              <button type="submit">Find Friend</button>
            </form>
            <div>
              <h3>Results</h3>
              <ul>
                Placeholder list
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FriendsPage;