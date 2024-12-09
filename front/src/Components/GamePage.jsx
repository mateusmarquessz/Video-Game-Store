import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "./AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/GamePage.css";

// Mapeamento das classificações com as imagens
const classificationImages = {
  "Livre": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-livre-logo.png",
  "10": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-10-anos-logo.png",
  "12": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-12-anos-logo-1.png",
  "14": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-14-anos-logo.png",
  "16": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-16-anos-logo.png",
  "18": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-18-anos-logo.png",
};

// Função para pegar a URL da imagem de classificação
const getClassificationImage = (ageRating) => {
  const classification = ageRating?.match(/\d+/)?.[0] || "Livre";
  return classificationImages[classification] || classificationImages["Livre"];
};

function GamePage() {
  const { id } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para modo de edição
  const [editedInfo, setEditedInfo] = useState({}); // Estado para as informações em edição
  const { isAuthenticated, userId, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/games/${id}`);
        const gameData = response.data;

        // Garantir que systemRequirements seja uma string bem estruturada
        if (typeof gameData.systemRequirements === "string") {
          gameData.systemRequirements = gameData.systemRequirements.split("\n\n"); // Divide por seções (Mínimos / Recomendados)
        } else if (!Array.isArray(gameData.systemRequirements)) {
          gameData.systemRequirements = []; // Se não for string nem array, inicialize como array vazio
        }

        setGame(gameData);
        setEditedInfo({
          ageRating: gameData.ageRating,
          systemRequirements: gameData.systemRequirements,
          description: gameData.description,
        });
      } catch (error) {
        console.error("There was an error fetching the game!", error);
        setError("Não foi possível carregar os dados do jogo.");
      }
    };

    fetchGame();
  }, [id]);

  const toggleFavorite = async (gameId) => {
    if (!isAuthenticated || !userId) return;

    try {
      const token = localStorage.getItem("token");
      if (favorites.includes(gameId)) {
        await axios.delete(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((id) => id !== gameId));
      } else {
        await axios.post(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites([...favorites, gameId]);
      }
    } catch (error) {
      console.error("Error toggling favorite!", error);
    }
  };

  const toggleCart = async (gameId) => {
    if (!isAuthenticated || !userId) return;

    try {
      const token = localStorage.getItem("token");
      if (cartItems.includes(gameId)) {
        await axios.delete(`http://localhost:8080/users/${userId}/Cart/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartItems.filter((id) => id !== gameId));
      } else {
        await axios.post(`http://localhost:8080/users/${userId}/Cart/${gameId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([...cartItems, gameId]);
      }
    } catch (error) {
      console.error("Error toggling Cart!", error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    const updatedGameData = {
      ageRating: editedInfo.ageRating,
      systemRequirements: editedInfo.systemRequirements.join("\n\n"), // Converte de volta para string separada por '\n\n'
      description: editedInfo.description,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/games/${game.id}`, updatedGameData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGame((prev) => ({
        ...prev,
        ...editedInfo,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving game information:", error);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!game) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="game-page">
        <div className="game-image">
          <img src={game.imageUrl} alt={game.name} />
        </div>
        <div className="game-details">
          <div className="gambiarra">
            <h1 className="game-name">{game.name}</h1>
            <button
              className="favorite-button-gamepage"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(game.id);
              }}
            >
              {favorites.includes(game.id) ? (
                <FaHeart color="#e58e27" style={{ borderColor: "#161a1e" }} />
              ) : (
                <FaRegHeart />
              )}
            </button>
          </div>
          <p className="genre">Gênero: {game.genre}</p>
          <p className="support">Tipo de Suporte: {game.typeOfSupport}</p>
          <p className="price">Preço: R${game.price.toFixed(2)}</p>
          <button
            className="buy-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCart(game.id);
            }}
          >
            Comprar
          </button>
        </div>
        <div className="additional-info">
          <h2>Informações Adicionais</h2>
          {isEditing ? (
            <div>
              <label>
                <strong>Descrição:</strong>
                <textarea
                  value={editedInfo.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                />
              </label>
              <label>
                <strong>Requisitos do Sistema:</strong>
                <textarea
                  value={editedInfo.systemRequirements.join("\n\n")}
                  onChange={(e) =>
                    handleEditChange(
                      "systemRequirements",
                      e.target.value.split("\n\n").map((item) => item.trim())
                    )
                  }
                />
              </label>
              <label>
                <strong>Classificação Indicativa:</strong>
                <input
                  type="text"
                  value={editedInfo.ageRating || ""}
                  onChange={(e) => handleEditChange("ageRating", e.target.value)}
                />
              </label>
              <button onClick={saveChanges}>Salvar</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          ) : (
            <div>
              {userRole === "ROLE_ADMIN" && (
                <button onClick={() => setIsEditing(true)}>Editar Informações</button>
              )}
              <p><strong>Descrição:</strong> {game.description}</p>
              <p><strong>Requisitos do Sistema:</strong></p>
              {game.systemRequirements.map((part, index) => (
                <div key={index}>
                  <p><strong>{index === 0 ? "Mínimos" : "Recomendados"}:</strong></p>
                  <ul>
                    {part.split("\n").map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p>
                <img
                  className="ratingImg"
                  src={getClassificationImage(game.ageRating)}
                  alt={`Classificação ${game.ageRating}`}
                />
                <strong>Classificação Indicativa:</strong> {game.ageRating}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GamePage;
