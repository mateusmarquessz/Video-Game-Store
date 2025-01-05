import React, { useState, useEffect } from 'react';
import "./css/UserPage.css";
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

// Função para buscar dados do usuário, jogos adquiridos e favoritos
const fetchAllData = async (userId, token, setUserData, setGames, setFavorites) => {
  try {
    // Buscar dados do usuário
    const response = await fetch(`https://video-game-store-aczz.onrender.com/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();

    // Atualizar os dados do usuário
    setUserData({
      username: userData.username || "",
      email: userData.email || "",
      bio: userData.bio || "",
      fullname: userData.fullname || "",
    });

    // Buscar jogos adquiridos
    const gamesResponse = await fetch(`https://video-game-store-aczz.onrender.com/users/${userId}/purchasedGame`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const gamesData = await gamesResponse.json();
    setGames(Array.isArray(gamesData) ? gamesData : []);

    // Buscar jogos favoritos
    const favoritesResponse = await fetch(`https://video-game-store-aczz.onrender.com/users/${userId}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const favoritesData = await favoritesResponse.json();
    setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    setGames([]); // Garantir que esses estados estejam vazios em caso de erro
    setFavorites([]);
  }
};

// Função para buscar a imagem de perfil
const fetchProfileImage = async (userId, token, setProfileImage) => {
  try {
    const response = await fetch(`https://video-game-store-aczz.onrender.com/users/${userId}/profile-image`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile image');
    }

    const imageUrl = await response.text();
    setProfileImage(imageUrl);  // Armazena a imagem em Base64
  } catch (error) {
    console.error("Erro ao buscar imagem de perfil:", error);
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
  });
  const [profileImage, setProfileImage] = useState(""); // Armazenar a imagem de perfil
  const [games, setGames] = useState([]); // Jogos adquiridos
  const [favorites, setFavorites] = useState([]); // Jogos favoritos
  const [activeTab, setActiveTab] = useState('games'); // Estado para controlar a aba ativa

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Verifique se o token e o userId estão disponíveis antes de fazer a requisição
    if (token && userId) {
      fetchAllData(userId, token, setUserData, setGames, setFavorites);
      fetchProfileImage(userId, token, setProfileImage);  // Chama a função para buscar a imagem
    }
  }, []); // Somente executa uma vez ao montar o componente

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

      await fetch(`https://video-game-store-aczz.onrender.com/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
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

        const response = await fetch(`https://video-game-store-aczz.onrender.com/users/${userId}/profile-image`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const updatedProfileImage = await response.json();
        setProfileImage(updatedProfileImage.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgVuh2SE-pI11IgdiiaJhxUdFNrq7zQOYKxEy73m4BuJSpuJ7vm3NtDDzcx2Gs3aciaXU&usqp=CAU");

        alert("Imagem de perfil atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar a imagem de perfil:", error);
      }
    }
  };

  const handleRedirect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const userId = localStorage.getItem('userId'); // Obtém o userId

  return (
    <>
      <Header />
      <div className='content'>
        <div className="user-page">
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src={profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgVuh2SE-pI11IgdiiaJhxUdFNrq7zQOYKxEy73m4BuJSpuJ7vm3NtDDzcx2Gs3aciaXU&usqp=CAU"}
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

                {/* Verifique se o userId não é 1 antes de exibir o campo Nome Completo */}
                {userId !== '1' && (
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
                )}

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
          </div>
        </div>
      </div>
    </>
  );
}

export default UserPage;
