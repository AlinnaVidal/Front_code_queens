import { useState, useEffect, useContext } from "react";
import "../common/App.css";
import "../common/Root.css";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [ setJoinedGames] = useState([]);
  const [ setMessage] = useState("");
  const { token } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

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
            const waitingGames = res.data.filter(game => game.state !== "invalid" );
            setGames(waitingGames);

            const stored = JSON.parse(localStorage.getItem("joinedGames")) || [];
            setJoinedGames(stored);
          })
          .catch(err => {
            console.error("Error al obtener partidas:", err);
            setMessage("Hubo un problema al cargar las partidas");
          });
      })
      .catch(err => {
        console.error("Token inválido o expirado:", err);
        setMessage("No estás logueado o el token expiró");
      });
  }, [token]);

  const FunRemove = (id) => {
    if (user?.user_type !== "admin") {
      alert("No tienes permisos para eliminar.");
      return;
    }

    if (window.confirm("¿Quieres eliminarlo?")) {
      fetch(`http://localhost:3000/games/${id}`, { method: "DELETE" ,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" }
      })
        .then(() => {
          setGames(prev => prev.filter(game => game.id !== id));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  return (
    <div className="about-us">

      <ul className="join-game-list">
        {games.length === 0 ? (
          <li className="no-games">No hay partidas en espera</li>
        ) : (
          games.map((game) => (
            <li className="join-game-item" key={game.id}>
              <span className="game-name">{game.name}</span> -
              <span className="game-state"> Estado: {game.state}</span>
              <button onClick={() => { FunRemove(game.id); }}>Borrar</button>
            </li>
          ))
        )}
      </ul>

    </div>
  );
}