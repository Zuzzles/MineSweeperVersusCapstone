import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getActive, getRequestTo, getRequestsFor } from "../../redux/game";
import "./UserDash.css"

function UserDash() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((store) => store.session)

  useEffect(() => {
    dispatch(getActive());
    dispatch(getRequestTo());
    dispatch(getRequestsFor());
  }, [dispatch])

  return (
    <>
      {loading ? (<p>Loading...</p>) : (
        user?.id ? (
          <div className="user-dash">
            <div className="user-buttons">
              <Link className='in-link' to="/issue">Initiate Game</Link>
              <Link className='add-link' to="/friends">Add Friends</Link>
            </div>
          </div>
        ) : null
      )}
    </>  
  );
}
  
export default UserDash;