import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom"; // useNavigate,
import { getActive, getRequestTo, getRequestsFor, cancelRequest } from "../../redux/game";
import OpenModalButton from "../OpenModalButton";
import ChallengeAcceptModal from "./ChallengeAcceptModal";
import './ChallengeRequest.css'

// TODO: handle decline request

function ChallengeRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { game, requestTo, requestsFor, loading } = useSelector((store) => store.game)

  useEffect( () => {
    dispatch(getActive());
    dispatch(getRequestTo());
    dispatch(getRequestsFor());
  }, [dispatch])

  const handleClick = async (id) => {
    dispatch(cancelRequest(id)).then(() => dispatch(getRequestsFor())).then((res) => {
      console.log("!!!", res)
      if(res.payload.requests.length === 0) navigate('/') 
    }
    );
  }

  return (
    loading ? (<div className="loading">Loading</div>) : (
      game ? (<Navigate to="/"/>) : (
        requestTo ? (<Navigate to="/"/>) : (
          requestsFor ? (
            <div className='challenge-requests'>
              <h2>Challenge Requests</h2>
              <ul>
                {requestsFor?.map((request, i) =>
                  <li key={i}>
                    <div>{`Challenge from ${request.host_name}`}</div>
                    <OpenModalButton 
                    modalComponent={<ChallengeAcceptModal request={request}/>}
                    buttonText={`Accept`}
                    />
                    <button onClick={() => handleClick(request.id)}>Decline</button>
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