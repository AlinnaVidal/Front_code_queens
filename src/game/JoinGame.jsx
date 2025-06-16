import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function JoinGame() {
  const [games, setGames] = useState([]);
  const [gamesJoinedIds, setGamesJoinedIds] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user) return;

    const fetchGamesAndCheckJoined = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allGames = res.data;
        const waitingGames = allGames.filter(game => game.state === "waiting" || game.state === "playing" );
        setGames(waitingGames);

        const joinedIds = await Promise.all(
          allGames.map(async (game) => {
            try {
              const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/players/from/${user.id}/${game.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              console.log(`Estás en la partida ${game.id}, status:`, res.status);
              return game.id;
            } catch (err) {
              console.log(`No estás en la partida ${game.id}, error:`, err.response?.status);
              return null;
            }
          })
        );

        setGamesJoinedIds(joinedIds.filter(id => id !== null));
      } catch (err) {
        console.error("Error general:", err);
        setMessage("Error al cargar partidas o verificar jugador");
      }
    };

    fetchGamesAndCheckJoined();
  }, [token, user, location]);

  const handleJoin = async (gameId) => {
    if (!user) {
      setMessage("Debes iniciar sesión para unirte a una partida");
      return;
    }

    try {
      const checkRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/players/from/${user.id}/${gameId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (checkRes.status === 200) {
        setMessage("Ya estás en esta partida, redirigiendo...");
        navigate(`/view/${gameId}`);
        return;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Error al verificar player:", err);
        setMessage("Error al verificar si ya estás en la partida");
        return;
      }
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/mechanics/add-player/${user.id}/${gameId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        setGamesJoinedIds(prev => [...prev, gameId]);
        setMessage("¡Te uniste a la partida!");
        setTimeout(() => {
          navigate(`/view/${gameId}`);
        }, 0);
      } else {
        setMessage("No se pudo unir a la partida");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "No se pudo unir a la partida";
      setMessage(`Error: ${errorMsg}`);
    }
  };

  const handleReturn = async (gameId) => {
    try {
      console.log("Intentando obtener estado de la partida:", gameId);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/games/${gameId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Respuesta del servidor:", res.data);

      if (res.data.state !== "waiting") {
        setMessage("La partida ya no está disponible. Por favor únete a otra.");
        setGamesJoinedIds(prev => prev.filter(id => id !== gameId));
        return;
      }

      navigate(`/view/${gameId}`);
    } catch (err) {
      console.error("Error al obtener el estado de la partida:", err);
      console.log("Detalles del error:", err.response);
      setMessage("Error al intentar volver a la partida.");
    }
  };

  return (
    <div className="join-game-container">
      <h2>Unirse a Partida</h2>


      {message && <p className="join-game-message">{message}</p>}

      <ul className="join-game-list">
        {games.length === 0 ? (
          <li className="no-games">No hay partidas en espera</li>
        ) : (
          games.map((game) => (
            <li className="join-game-item" key={game.id}>
              <span className="game-name">{game.name}</span> -
              <span className="game-state"> Estado: {game.state}</span>
              <button
                className="join-game-button"
                onClick={() =>
                  gamesJoinedIds.includes(game.id)
                    ? handleReturn(game.id)
                    : handleJoin(game.id)
                }
              >
                {gamesJoinedIds.includes(game.id) ? "Ir a la partida" : "Unirse"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default JoinGame;
