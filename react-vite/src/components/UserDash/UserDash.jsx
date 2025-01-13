import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function UserDash() {
  const { user, loading } = useSelector((store) => store.session)

  return (
    <>
      {loading ? (<p>Loading...</p>) : (
        <div>
          {user ? (
            <div>
              <Link to="/issue">Initiate Game</Link>
              <Link to="/friends">Add Friends</Link>
            </div>
          ) : null}
        </div>
      )}
    </>  
  );
}
  
export default UserDash;