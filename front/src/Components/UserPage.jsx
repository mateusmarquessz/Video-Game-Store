import React, { useState, useEffect } from 'react';
import "./css/UserPage.css";
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Função para buscar dados do usuário
const fetchUserData = async (userId, token, setUserData) => {
  try {
    const response = await axios.get(`https://video-game-store-aczz.onrender.com/users/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserData(response.data);
  } catch (error) {
    console.error("Erro ao buscar os dados do usuário:", error);
  }
};

// Função para buscar jogos adquiridos
const fetchUserGames = async (userId, token, setGames) => {
  try {
    const response = await axios.get(`https://video-game-store-aczz.onrender.com/users/${userId}/purchasedGame`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGames(response.data);
  } catch (error) {
    console.error("Erro ao buscar jogos adquiridos:", error);
  }
};

// Função para buscar jogos favoritos
const fetchUserFavorites = async (userId, token, setFavorites) => {
  try {
    const response = await axios.get(`https://video-game-store-aczz.onrender.com/users/${userId}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(response.data);
  } catch (error) {
    console.error("Erro ao buscar jogos favoritos:", error);
  }
};

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
  const [games, setGames] = useState([]); // Jogos adquiridos
  const [favorites, setFavorites] = useState([]); // Jogos favoritos
  const [activeTab, setActiveTab] = useState('games'); // Estado para controlar a aba ativa

  const defaultProfileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgVuh2SE-pI11IgdiiaJhxUdFNrq7zQOYKxEy73m4BuJSpuJ7vm3NtDDzcx2Gs3aciaXU&usqp=CAU";

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

   
    fetchUserData(userId, token, setUserData);
    fetchUserGames(userId, token, setGames);
    fetchUserFavorites(userId, token, setFavorites);
  }, []);

  const handleEdit = () => setEditMode(!editMode);
  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const updatedData = {
        username: userData.username,
        bio: userData.bio,
        fullname: userData.fullname,
      };

      await axios.put(`https://video-game-store-aczz.onrender.com/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditMode(false);
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar os dados do usuário:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await axios.put(`https://video-game-store-aczz.onrender.com/users/${userId}/profile-image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        // Verifique se a resposta contém a URL da imagem
        const updatedProfileImage = response.data.profileImage || defaultProfileImage;

        // Atualiza a URL da imagem após a resposta
        setUserData((prevData) => ({
          ...prevData,
          profileImage: updatedProfileImage.startsWith("http") ? updatedProfileImage : `https://video-game-store-aczz.onrender.com${updatedProfileImage}`,
        }));

        alert("Imagem de perfil atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar a imagem de perfil:", error);
      }
    }
  };

  // Função para redirecionar para a página de detalhes do jogo
  const handleRedirect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <>
      <Header />
      <div className='content'>
        <div className="user-page">
          <div className="profile-header">
            {/* Verificando se os dados do usuário estão carregados */}
            {userData.username ? (
              <>
                <div className="profile-image-container">
                  <img
                    src={userData.profileImage || defaultProfileImage}
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
                    <i className="fas fa-camera"></i> Alterar Imagem
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
                    <i className={`fas ${editMode ? 'fa-save' : 'fa-edit'}`}></i> {editMode ? "Salvar" : "Editar"}
                  </button>
                  <button onClick={handleLogout} className="logout-button">
                    <i className="fas fa-sign-out-alt"></i> Sair
                  </button>
                </div>
  
                {/* Header para alternar entre jogos adquiridos e favoritos */}
                <div className="tabs">
                  <button
                    className={`tab-button ${activeTab === 'games' ? 'active' : ''}`}
                    onClick={() => setActiveTab('games')}
                  >
                    <i className="fas fa-gamepad"></i> Jogos Adquiridos
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <i className="fas fa-heart"></i> Jogos Favoritos
                  </button>
                </div>
  
                {/* Conteúdo das seções baseadas na aba ativa */}
                <div className="games-wrapper">
                  {activeTab === 'games' && (
                    <div className="games-section">
                      <h2>Jogos Adquiridos</h2>
                      <ul className='games-list'>
                        {games.length === 0 ? (
                          <p>Você ainda não adquiriu jogos.</p>
                        ) : (
                          games.map((game) => (
                            <li key={game.id}>
                              <img src={game.imageUrl || `data:image/jpeg;base64,${game.image}`} alt={game.name} className="cart-item-image" />
                              <p>{game.name}</p>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                  {activeTab === 'favorites' && (
                    <div className="favorites-section">
                      <h2>Jogos Favoritos</h2>
                      <ul className='favorites-list-Page'>
                        {favorites.length === 0 ? (
                          <p>Você ainda não possui jogos favoritos.</p>
                        ) : (
                          favorites.map((game) => (
                            <li key={game.id} onClick={() => handleRedirect(game.id)}>
                              <img src={game.imageUrl || `data:image/jpeg;base64,${game.image}`} alt={game.name} className="cart-item-image" />
                              <p>{game.name}</p>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p>Carregando...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
  
}

export default UserPage;