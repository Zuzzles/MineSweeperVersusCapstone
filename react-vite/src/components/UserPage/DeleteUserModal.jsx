// import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import { thunkDeleteUser } from "../../redux/session";
import "./DeleteModal.css";

function DeleteUserModal(user) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = user?.user.id;

    const serverResponse = await dispatch(
      thunkDeleteUser(id)
    );

    if (serverResponse.type === "session/deleteUser/rejected") {
      // skip for now
    } else {
      closeModal();
      navigate('/');
    }
  };

  return (
    <div className="delete-user">
      <h1>Delete User?</h1>
      <form onSubmit={handleSubmit}>
        {user?.user.username == 'Demo 1' || user?.user.username == 'Demo 2' ? (
          <button type="button" onClick={() => alert("Can not delete demo user")}>Delete User</button>
        ) : (
          <button type="submit">Delete User</button>
        )}
      </form>
    </div>
  );
}

export default DeleteUserModal;