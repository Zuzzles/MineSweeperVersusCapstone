import { useEffect, useState } from "react";

function FriendSearch({ users, details, requested }) {
  const [userSearch, setUserSearch] = useState(users?.filter((user) => !(
    details?.list.map((item) => item.username).includes(user.username) ||
    details?.requests.map((item) => item.username).includes(user.username) ||
    requested?.map((item) => item.username).includes(user.username)
  )));

  // TODO: get this working on refresh
  // TODO: set up route for send request


  const handleSearch = async (e) => {
    e.preventDefault();


  }

  return (
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
          {userSearch?.length === 0 ? (<p>No Results</p>) : (
            userSearch?.map((request, i) => 
              <li key={i}>
                {request.username}
                <button>Send Request</button>
              </li>)
          )}
        </ul>
      </div>
    </div>
  )
}

export default FriendSearch;