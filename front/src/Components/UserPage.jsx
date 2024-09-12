import React, { useState } from 'react';
import "./css/UserPage.css";
import Header from './Header'; // Importe o Header

function UserPage() {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: "Julia Silva",
    email: "julia@example.com",
    bio: "Desenvolvedora apaixonada por tecnologia e inovação.",
  });

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header /> {/* Renderize o Header aqui */}
      <div className='content'>
      <div className="user-page">
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/150"
            alt="User"
            className="profile-image"
          />
          <h1>{userData.name}</h1>
          <button onClick={handleEdit} className="edit-button">
            {editMode ? "Save" : "Edit"}
          </button>
        </div>
        <div className="profile-details">
          <div className="profile-info">
            <label>
              Email:
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData.email}</p>
              )}
            </label>
            <label>
              Bio:
              {editMode ? (
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData.bio}</p>
              )}
            </label>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default UserPage;
