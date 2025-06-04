// src/components/ViewGames.jsx
import React, { useEffect, useState } from 'react';

function ViewGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Error al obtener partidas:', err));
  }, []);

  return (
    <div>
      <h2>Todas las Partidas</h2>
      <ul>
        {games.length === 0 ? (
          <li>No hay partidas</li>
        ) : (
          games.map((game) => (
            <li key={game.id}>
              {game.name} - Estado: {game.state}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ViewGames;
