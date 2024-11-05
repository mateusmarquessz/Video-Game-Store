import React, { useState } from 'react';
import "./css/UserPage.css";
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function UserPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout(); // Chama a função de logout
    navigate('/login'); // Redireciona para a página de login
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
            <button onClick={handleLogout} className="logout-button">Logout</button> {/* Botão de logout */}
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
