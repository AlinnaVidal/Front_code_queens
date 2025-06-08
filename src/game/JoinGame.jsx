import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';


function JoinGame() {
  const [games, setGames] = useState([]);
  const [joinedGames, setJoinedGames] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) return;

    //verificamso que el token JWT sea valido
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/games`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          const waitingGames = res.data.filter(game => game.state === 'waiting');
          setGames(waitingGames);

          const stored = JSON.parse(localStorage.getItem('joinedGames')) || [];
          setJoinedGames(stored);
        })
        .catch(err => {
          console.error('Error al obtener partidas:', err);
          setMessage('Hubo un problema al cargar las partidas');
        });
    })
    .catch(err => {
      console.error('Token inválido o expirado:', err);
      setMessage('No estás logueado o el token expiró');
    });
  }, [token]);

  const handleJoin = async (gameId) => {
    if (!user) {
      setMessage('Debes iniciar sesión para unirte a una partida');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/mechanics/add-player/${user.id}/${gameId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 201) {
        setMessage('¡Te uniste a la partida!');
        const updatedJoined = [...joinedGames, gameId];
        setJoinedGames(updatedJoined);
        localStorage.setItem('joinedGames', JSON.stringify(updatedJoined));
        navigate(`/games/${gameId}`);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'No se pudo unir a la partida';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  const handleReturn = (gameId) => {
    navigate(`/games/${gameId}`);
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
                  joinedGames.includes(game.id)
                    ? handleReturn(game.id)
                    : handleJoin(game.id)
                }
              >
                {joinedGames.includes(game.id) ? 'Volver a la partida' : 'Unirse'}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

}

export default JoinGame;
