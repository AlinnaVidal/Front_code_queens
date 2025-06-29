import { useState, useEffect, useContext } from "react";
import "../common/App.css";
import "../common/Root.css";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [setMessage] = useState("");
  const { token } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    //verificamso que el token JWT sea valido
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/players`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) .then(res => {
      setPlayers(res.data);
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
      fetch(`${import.meta.env.VITE_BACKEND_URL}/players/${id}`, { method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`,"Content-Type": "application/json" } })
        .then(() => {
          setPlayers(prev => prev.filter(player => player.id !== id));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  return (
    <div className="about-us">

      <ul className="join-game-list">
        {players.length === 0 ? (
          <li className="no-games">No hay usuarios</li>
        ) : (
          players.map((player) => (
            <li className="player" key={player.id}>
              <span className="user-id"> user id: {player.user_id}</span>&nbsp;&nbsp; - &nbsp;&nbsp;
              <span className="user-id"> color: {player.color}</span>
              <button onClick={() => { FunRemove(player.id); }}>Borrar</button>
            </li>
          ))
        )}
      </ul>

    </div>
  );
}