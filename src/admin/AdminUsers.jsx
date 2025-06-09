import { useState, useEffect, useContext } from 'react';
import '../common/App.css'
import '../common/Root.css'
import { Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminGames() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    //verificamso que el token JWT sea valido
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) .then(res => {
    setUsers(res.data); 
  })
    .catch(err => {
      console.error('Token inválido o expirado:', err);
      setMessage('No estás logueado o el token expiró');
    });
  }, [token]);

  const FunRemove = (id) => {
    if (user?.user_type !== 'admin') {
      alert("No tienes permisos para eliminar.");
      return;
    }
    if (window.confirm("¿Quieres eliminarlo?")) {
      fetch(`http://localhost:3000/users/${id}`, { method: "DELETE",      
         headers: {Authorization: `Bearer ${token}`,"Content-Type": "application/json" } })
        .then(() => {
          setUsers(prev => prev.filter(user => user.id !== id));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };


  return (
    <div className="about-us"> 

    <ul className="join-game-list">
        {users.length === 0 ? (
          <li className="no-games">No hay usuarios</li>
        ) : (
          users.map((user) => (
            <li className="user-id" key={user.id}>
              <span className="user-name">{user.name_user}</span>&nbsp;&nbsp; - &nbsp;&nbsp;
              <button onClick={() => { FunRemove(user.id) }}>Borrar</button>
            </li>
          ))
        )}
      </ul>


    </div>
  )
}