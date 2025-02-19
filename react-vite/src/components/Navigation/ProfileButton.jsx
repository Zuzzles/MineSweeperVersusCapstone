import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";

// TODO pick background color and round edges
// TODO fix logout button

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user, loading } = useSelector((store) => store.session);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate('/');
  };

  return (
    <>
      <button className='profile-icon' onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown" + (showMenu ? "" : " hidden")} ref={ulRef}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className='drop-down-items user-info'>
                <li>{user.username}</li>
                <li>{user.email}</li>
              </div>
              <div className='drop-down-items user-space'>
                <li><NavLink onClick={closeMenu} to="/user">Edit User</NavLink></li>
              </div>
              <div className='drop-down-items main-nav'>
                <li><NavLink onClick={closeMenu} to="/issue">Initiate Game</NavLink></li>
                <li><NavLink onClick={closeMenu} to="/friends">Add Friends</NavLink></li>
              </div>
              <li className="logout">
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
