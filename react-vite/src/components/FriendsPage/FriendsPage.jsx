import { useEffect, useState } from "react";  // useState
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/friend";

function FriendsPage() {
  const dispatch = useDispatch();
  const users = useSelector((store) => store.game.users)
  const [userSearch, setUserSearch] = useState([]);

  // useEffect(() => {

  // })

  return (
    <div>
      <div className="friends-and-requests">
        <h2>Friends List</h2>
        <ul>
          Placeholder list
        </ul>
        <h2>Friend Requests</h2>
        <ul>
          Placeholder list
        </ul>
      </div>
      <div>
        <h2>Search Friend by Username</h2>
        <form>
          <input 
            type="search"
            
          />
          <button type="submit">Find Friend</button>
        </form>
        <div>
          <h3>Results</h3>
          <ul>
            Placeholder list
            {userSearch.list}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FriendsPage;