import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkEditUser } from "../../redux/session";
import "./EditModal.css";

function EditUserModal(user) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    setEmail(user?.user.email);
    setUsername(user?.user.username);
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = user?.user.id

    const serverResponse = await dispatch(
      thunkEditUser({
        id,
        email,
        username,
      })
    );

    if (serverResponse.type === "session/editUser/rejected") {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="edit-user-modal">
      <h1>Edit User</h1>
      {errors.payload?.server && <p>{errors.payload?.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.payload?.email && <p>{errors.payload?.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.payload?.username && <p>{errors.payload?.username}</p>}
        {user?.user.username == 'Demo 1' || user?.user.username == 'Demo 2' ? (
          <button type="button" onClick={() => alert("Can not edit demo user")}>Edit User</button>
        ) : (
          <button type="submit">Edit User</button>
        )}
      </form>
    </div>
  );
}

export default EditUserModal;