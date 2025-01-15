import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendDetails } from "../../redux/friend";
import { OpenModalMenuItem } from "../Navigation";
import IssueFormModal from "./IssueChallengeFormModal";

function IssuePage() {
  const dispatch = useDispatch();
  const { details, loading } = useSelector((store) => store.friends)
  const [searchResults, setSearchResults] = useState([])

  // TODO: css styling
  // TODO: get search working

  useEffect(() => {
    dispatch(getFriendDetails());
  }, [dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();


  }

  return (
    <div>
      <div className="challenge-requests">
        <h2>Choose Opponent</h2>
        <ul>
          {loading ? (<p>Loading</p>) : (
            <>{details?.list.map((item) => (<OpenModalMenuItem 
              modalComponent={<IssueFormModal user={item}/>}
              itemText={item.username}
            /> ))}</>
          )}
        </ul>
      </div>
      <div>
        <h2>Search Opponent by Username</h2>
        <form onSubmit={handleSearch}>
          <input />
          <button type="submit">Find Friend</button>
        </form>
        <div>
          <h3>Results</h3>
          <ul>
          {searchResults?.length === 0 ? (<p>No Results</p>) : (
            searchResults?.map((request, i) => 
              <li key={i}>
                {request.username}
                <button>Send Request</button>
              </li>)
          )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IssuePage;