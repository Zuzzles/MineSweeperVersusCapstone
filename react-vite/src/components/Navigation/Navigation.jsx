import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
import { getActive } from "../../redux/game";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(store => store.session)
  const { init } = useSelector(store => store.game)

  useEffect(() => {
    dispatch(getActive());
  }, [dispatch])
  
  if (!loading && !user ) {
    navigate('/');
  }

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {init ? (
        <li>
          <NavLink to={`/game/${init.id}`}>Active Game</NavLink>
        </li>
      ): null}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
