import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const { user, loading } = useSelector(store => store.session)
  
  if (!loading && !user ) {
    navigate('/');
  }

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/game">Active Game</NavLink>
      </li>
      {/* {true ? (
        <li>
          <NavLink to="/game">Active Game</NavLink>
        </li>
      ): null} */}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
