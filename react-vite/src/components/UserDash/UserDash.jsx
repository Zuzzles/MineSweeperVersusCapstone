import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./UserDash.css"

function UserDash() {
  const { user, loading } = useSelector((store) => store.session)

  return (
    <>
      {loading ? (<p>Loading...</p>) : (
        user?.id ? (
          <div className="user-dash">
            <Link to="/issue">Initiate Game</Link>
            <Link to="/friends">Add Friends</Link>
          </div>
        ) : null
      )}
    </>  
  );
}
  
export default UserDash;