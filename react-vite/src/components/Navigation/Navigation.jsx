import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
import { getActive, getRequestTo, getRequestsFor } from "../../redux/game";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(store => store.session)
  const { requestTo, requestsFor, init } = useSelector(store => store.game)

  useEffect(() => {
    dispatch(getActive());
    dispatch(getRequestTo());
    dispatch(getRequestsFor());
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
      ) : null}
      {!init && requestTo ? (
        <li>
          <NavLink to={"/waiting"}>Waiting Room</NavLink>
        </li>
      ) : null}
      {!init && !requestTo && requestsFor?.length !== 0 ? (
        <li>
          <NavLink to={"/challenges"}>Game Requests</NavLink>
        </li>
      ) : null}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
