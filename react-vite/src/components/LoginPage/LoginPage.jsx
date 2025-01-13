import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkLogin } from "../../redux/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div>
        <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
        />
        <button onClick={handleLogin1}>
          Demo 1 Login
        </button>
        <button onClick={handleLogin2}>
          Demo 2 Login
        </button>
    </div>  
  );
}

export default LoginPage;