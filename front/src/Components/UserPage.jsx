import React, { useState, useEffect } from 'react';
import "./css/UserPage.css";
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    fullname: "",
    profileImage: "", 
  });

  // Imagem padrão para o usuário
  const defaultProfileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgVuh2SE-pI11IgdiiaJhxUdFNrq7zQOYKxEy73m4BuJSpuJ7vm3NtDDzcx2Gs3aciaXU&usqp=CAU";

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8080/users/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle edit mode toggle
  const handleEdit = () => {
    setEditMode(!editMode);
  };

  // Handle change in input fields
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });  
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Atualiza imagem
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
  
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
  
        const response = await axios.put(`http://localhost:8080/users/${userId}/profile-image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
  
        // Atualiza a URL da imagem após a resposta
        setUserData((prevData) => ({
          ...prevData,
          profileImage: response.data.profileImageURL || "", // Aqui deve estar a URL retornada do backend
        }));
  
        alert("Imagem de perfil atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar a imagem de perfil:", error);
      }
    }
  };

  // Handle save the updated data
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

    
      const updatedData = {
        username: userData.username,
        bio: userData.bio,
        fullname: userData.fullname,
      };

      await axios.put(`http://localhost:8080/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEditMode(false);
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar os dados do usuário:", error);
    }
  };

  return (
    <>
      <Header />
      <div className='content'>
        <div className="user-page">
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src={userData.imageUrl || defaultProfileImage}
                alt="User"
                className="profile-image"
              />
              <input
                type="file"
                id="imageInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                className="change-image-button"
                onClick={() => document.getElementById('imageInput').click()}
              >
                Alterar Imagem
              </button>
            </div>
            <h1>
              {editMode ? (
                <textarea
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData.username}</p>
              )}
            </h1>
            <div className="profile-details">
              <div className="profile-info">
                <label>
                  Email:
                  <p>{userData.email}</p> {/* Email fixo, não editável */}
                </label>
                <label>
                  Nome Completo:
                  {editMode ? (
                    <textarea
                      name="fullname"
                      value={userData.fullname}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{userData.fullname}</p>
                  )}
                </label>
                <label>
                  Biografia:
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
              <button onClick={editMode ? handleSave : handleEdit} className="edit-button">
                {editMode ? "Salvar" : "Editar"}
              </button>
              <button onClick={handleLogout} className="logout-button">Sair</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserPage;
