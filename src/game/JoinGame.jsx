// src/components/JoinGame.jsx
import React, { useEffect, useState } from 'react';

function JoinGame() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
      .then(res => res.json())
      .then(data => {
        const waitingGames = data.filter(game => game.state === 'waiting');
        setGames(waitingGames);
      })
      .catch(err => console.error('Error al obtener partidas:', err));
  }, []);

  return (
    <div>
      <h2>Unirse a Partida</h2>
      <ul>
        {games.length === 0 ? (
          <li>No hay partidas en espera</li>
        ) : (
          games.map((game) => (
            <li key={game.id}>
              {game.name} - Estado: {game.state}
              {/* Aquí podrías añadir un botón para unirse */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default JoinGame;
