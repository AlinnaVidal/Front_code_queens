import { useState } from 'react';

function CreateGame() {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? parseInt(user.id) : null;

  const handleCreateGame = async () => {
    if (!name || !maxPlayers) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/new-game/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            max_capacity: parseInt(maxPlayers),
          }),
        }
      );

      if (response.status === 201) {
        setMessage('¡Partida creada exitosamente!');
        setName('');
        setMaxPlayers('');
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error || 'No se pudo crear la partida'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Crear Partida</h2>
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
        placeholder="Máximo de jugadores"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(e.target.value)}
      />
      <br />
      <button className="create-game-button" onClick={handleCreateGame}>
        Crear partida
      </button>
      <p>{message}</p>
    </div>
  );
}

export default CreateGame;
