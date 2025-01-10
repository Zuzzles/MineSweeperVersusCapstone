import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {true ? (
        <li>
          <NavLink to="/game">Active Game</NavLink>
        </li>
      ): null}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
