import { useEffect } from "react";  // , useState
import { useDispatch, useSelector } from "react-redux";
import { getFriendDetails } from "../../redux/friend";
import { OpenModalMenuItem } from "../Navigation";
import IssueFormModal from "./IssueChallengeFormModal";
import SearchComponent from "../Search/SearchComponent";
import './IssueChallenge.css';

function IssuePage() {
  const dispatch = useDispatch();
  const { details, loading } = useSelector((store) => store.friends)

  // TODO: css styling
  // TODO: get search working

  useEffect(() => {
    dispatch(getFriendDetails());
  }, [dispatch]);

  return (
    <div className='challenge-page'>
      <div className="challenge-requests">
        <h2>Choose Opponent</h2>
        <ul>
          {loading ? (<p>Loading</p>) : (
            <>{details?.list?.map((item, i) => (<OpenModalMenuItem 
              key={i}
              modalComponent={<IssueFormModal user={item}/>}
              itemText={item.username}
            /> ))}</>
          )}
        </ul>
      </div>
      <SearchComponent data={details?.list} friend={false}/>
    </div>
  )
}

export default IssuePage;