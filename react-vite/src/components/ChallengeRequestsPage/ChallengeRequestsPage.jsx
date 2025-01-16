import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom"; // useNavigate,
import { getActive, getRequestTo, getRequestsFor } from "../../redux/game";
import OpenModalButton from "../OpenModalButton";
import ChallengeAcceptModal from "./ChallengeAcceptModal";

// TODO: handle decline request

function ChallengeRequests() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { game, requestTo, requestsFor, loading } = useSelector((store) => store.game)

  useEffect( () => {
    dispatch(getActive());
    dispatch(getRequestTo());
    dispatch(getRequestsFor());
  }, [dispatch])

  const handleClick = async (e) => {
    e.preventDefault();
  }

  return (
    loading ? (<div>Loading</div>) : (
      game ? (<Navigate to="/"/>) : (
        requestTo ? (<Navigate to="/"/>) : (
          requestsFor ? (
            <div>
              <h2>Challenge Requests</h2>
              <ul>
                {requestsFor?.map((request, i) =>
                  <li key={i}>
                    <div>{`Challenge from ${request.host_name}`}</div>
                    <OpenModalButton 
                    modalComponent={<ChallengeAcceptModal request={request}/>}
                    buttonText={`Accept`}
                    />
                    <button onClick={handleClick}>Decline</button>
                  </li>
                )}
              </ul>
            </div>
          ) : (<Navigate to="/"/>)
        )
      ) 
    )
  )
}

export default ChallengeRequests