import { useState } from 'react';

function CreateGame() {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userId = user ? parseInt(user.id) : null;

  const handleCreateGame = async () => {

    if (!name || !maxPlayers) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    const numPlayers = parseInt(maxPlayers);
    if (numPlayers < 2 || numPlayers > 4) {
      setMessage('El número de jugadores debe estar entre 2 y 4');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/new-game/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify({
            name: name,
            max_capacity: numPlayers,
          }),
        }
      );

      if (response.status === 201) {
        const createdGame = await response.json(); 
        const joined = JSON.parse(localStorage.getItem('joinedGames')) || [];
        const updatedJoined = [...joined, createdGame.id];
        localStorage.setItem('joinedGames', JSON.stringify(updatedJoined));

        setMessage('¡Partida creada exitosamente!');
        setName('');
        setMaxPlayers('');
      }
      else {
        const data = await response.json();
        setMessage(`Error: ${data.error || 'No se pudo crear la partida'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al conectar con el servidor');
    }
  };


  return (
    <div className="view-games-container">
      <h2 className="view-games-title">Crear Partida</h2>

      <input
        className="create-game-input"
        type="text"
        placeholder="Nombre de la partida"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        className="create-game-input"
        type="number"
        min="2"
        max="4"
        placeholder="Máximo de jugadores"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(e.target.value)}
      />
      <br />

      <button className="create-game-button" onClick={handleCreateGame}>
        Crear partida
      </button>

      {message && <p className="create-game-message">{message}</p>}
    </div>
  );

}

export default CreateGame;
