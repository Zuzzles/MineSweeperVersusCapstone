import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

function UserDash() {
  const { user, loading } = useSelector((store) => store.session)

  return (
    <>
      {loading ? (<p>Loading...</p>) : (
        <div>
          {user ? (
            <div>
              <Link to="">Start Game</Link>
              <Link to="">Add Friends</Link>
            </div>
          ) : null}
        </div>
      )}
    </>  
  );
}
  
export default UserDash;