import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function LoginPage() {
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
    </div>  
  );
}

export default LoginPage;