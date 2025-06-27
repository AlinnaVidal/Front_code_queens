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
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/games`, { headers: { Authorization: `Bearer ${token}` } });

        const allGames = res.data;
        const waitingGames = allGames.filter(game => game.state === "waiting" || game.state === "playing" );
        setGames(waitingGames);

        const joinedIds = await Promise.all(
          allGames.map(async (game) => {
            try {
              await axios.get(`${import.meta.env.VITE_BACKEND_URL}/players/from/${user.id}/${game.id}`, { headers: { Authorization: `Bearer ${token}` } });
              return game.id;
            } catch {
              return null;
            }
          })
        );

        setGamesJoinedIds(joinedIds.filter((id) => id !== null));
      } catch (err) {
        console.error("Error general:", err);
        setMessage("Error al cargar partidas o verificar jugador");
      }
    };
    fetchGamesAndCheckJoined();
  }, [token, user, location]);

  const handleJoin = async (gameId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/mechanics/add-player/${user.id}/${gameId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGamesJoinedIds((prev) => [...prev, gameId]);
      setMessage("¡Te uniste a la partida!");
      navigate(`/view/${gameId}`);
    } catch (err) {
      setMessage(
        `Error al unirse a la partida: ${err.response?.data?.error || err.message}`
      );
    }
  };

  const handleReturn = (gameId) => {
    navigate(`/view/${gameId}`);
  };

  return (
    <div className="join-game-container">
      <h2>Unirse a Partida</h2>


      {message && <p className="join-game-message">{message}</p>}

      <ul className="join-game-list">
        {games.length === 0 ? (
          <li className="no-games">No hay partidas disponibles</li>
        ) : (
          games.map((game) => {
            const isJoined = gamesJoinedIds.includes(game.id);
            const isWaiting = game.state === "waiting";
            const isPlaying = game.state === "playing";

            return (
              <li className="join-game-item" key={game.id}>
                <span className="game-name">{game.name}</span> -
                <span className="game-state"> Estado: {game.state}</span>

                {isWaiting && (
                  <button
                    className="join-game-button"
                    onClick={() => (isJoined ? handleReturn(game.id) : handleJoin(game.id))}
                  >
                    {isJoined ? "Volver a la partida" : "Unirse"}
                  </button>
                )}

                {isPlaying && isJoined && (
                  <button
                    className="join-game-button"
                    onClick={() => handleReturn(game.id)}
                  >
                    Volver a la partida
                  </button>
                )}

                {isPlaying && !isJoined && (
                  <span className="game-closed-message">En juego</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default JoinGame;
