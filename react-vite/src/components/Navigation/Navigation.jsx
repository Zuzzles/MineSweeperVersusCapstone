import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
import { getActive, getRequestTo, getRequestsFor } from "../../redux/game";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

// TODO make navigation home button

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
    <div className="navbar">
      <NavLink to="/"><img className='home-img' src="../../../public/images/Naval_Mine_scribblenauts.webp" /></NavLink>
      <div className="navbar-right">
        {init ? (
          <NavLink to={`/game/${init.id}`}>Active Game</NavLink>
        ) : null}
        {!init && requestTo ? (
          <NavLink to={"/waiting"}>Waiting Room</NavLink>
        ) : null}
        {!init && !requestTo && requestsFor?.length !== 0 ? (
          <NavLink to={"/challenges"}>Game Requests</NavLink>
        ) : null}
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
