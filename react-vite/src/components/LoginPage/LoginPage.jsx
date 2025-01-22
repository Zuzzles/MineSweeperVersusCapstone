import { useState } from "react";
import { useDispatch } from "react-redux"; // , useSelector
import { useNavigate } from "react-router-dom";
import { thunkLogin } from "../../redux/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './LoginPage.css';

// TODO add in background image 
// TODO change button colors
// TODO add in icon

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { user, loading } = useSelector(store => store.session)
  const [errors, setErrors] = useState({});

  const handleLogin1 = async (e) => {
    e.preventDefault();

    const email = 'demo1@aa.io'
    const password = 'password'

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse.type === "session/login/rejected") {
      setErrors(serverResponse);
      console.log(errors)
    } else {
      navigate("/")
    }
  };

  const handleLogin2 = async (e) => {
    e.preventDefault();

    const email = 'demo2@aa.io'
    const password = 'password'

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse.type === "session/login/rejected") {
      setErrors(serverResponse);
      console.log(errors)
    } else {
      navigate("/");
    }
  };

  return (
    <div className='login-page'>
      <h1>MineSweeper Versus</h1>
      <div className='reg-login'>
        <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
        />
      </div>
      <div className='demo-login'>
        <button onClick={handleLogin1}>
          Demo 1 Login
        </button>
        <button onClick={handleLogin2}>
          Demo 2 Login
        </button>
      </div>
    </div>  
  );
}

export default LoginPage;