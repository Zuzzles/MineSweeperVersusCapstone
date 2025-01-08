import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import LoginPage from "../components/LoginPage"

export default function Layout() {
  const dispatch = useDispatch();
  // const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useSelector((store) => store.session)
  useEffect(() => {
    dispatch(thunkAuthenticate()) //.then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div>
      <ModalProvider>
        {user ? (<Navigation />) : (<LoginPage />)}
        {/*isLoaded*/loading && <Outlet />}
        <Modal />
      </ModalProvider>
    </div>
  );
}
