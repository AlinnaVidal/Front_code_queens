import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinGame() {
  const [games, setGames] = useState([]);
  const [joinedGames, setJoinedGames] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
      .then(res => res.json())
      .then(data => {
        const waitingGames = data.filter(game => game.state === 'waiting');
        setGames(waitingGames);

        const stored = JSON.parse(localStorage.getItem('joinedGames')) || [];
        setJoinedGames(stored);
      })
      .catch(err => console.error('Error al obtener partidas:', err));
  }, []);

  const handleJoin = async (gameId) => {
    if (!user) {
      setMessage('Debes iniciar sesión para unirte a una partida');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/add-player/${user.id}/${gameId}`, {
        method: 'POST',
      });

      if (response.status === 201) {
        setMessage('¡Te uniste a la partida!');
        const updatedJoined = [...joinedGames, gameId];
        setJoinedGames(updatedJoined);
        localStorage.setItem('joinedGames', JSON.stringify(updatedJoined));
        navigate(`/view/${gameId}`);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error || 'No se pudo unir a la partida'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al conectar con el servidor');
    }
  };

  const handleReturn = (gameId) => {
    navigate(`/view/${gameId}`);
  };

  return (
    <div>
      <h2>Unirse a Partida</h2>
      {message && <p>{message}</p>}
      <ul>
        {games.length === 0 ? (
          <li>No hay partidas en espera</li>
        ) : (
          games.map((game) => (
            <li key={game.id}>
              {game.name} - Estado: {game.state}
              <button
                onClick={() =>
                  joinedGames.includes(game.id)
                    ? handleReturn(game.id)
                    : handleJoin(game.id)
                }
                style={{ marginLeft: '1em' }}
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
