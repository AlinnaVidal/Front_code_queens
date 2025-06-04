import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Game() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games`);
        setGames(response.data);
      } catch (error) {
        console.error('Error al obtener las partidas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) {
    return <p>Cargando partidas...</p>;
  }

  return (
    <div>
      <h2>Partidas Disponibles</h2>
      {games.length === 0 ? (
        <p>No hay partidas disponibles.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              ID: {game.id} - Estado: {game.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
