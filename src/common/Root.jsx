import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import './App.css'
import './Root.css'
import img_logo from '../assets/logo.png';






 function LandingPage() {

  const [games, setGames] = useState([]);


    useEffect(() => {
      fetch("http://localhost:3000/games") // Pon aquí la URL de la API GET
        .then((res) => res.json())
        .then((data) => setGames(data))
        .catch((err) => console.error(err));
    }, []);


  return (
    
    <div className="about-us"> 

      <img src={img_logo} alt="Logo de Blokas" className="logo" />


      <p className= "black_text">
          ¡Bienvenido a Blokas!                                                                                                                                                                                                                                                                                      
      </p>

      <p className= "black_text">
          Registrate o inicia sesión para jugar                                                                                                                                                                                                                                                                                      
      </p>

      <p className= "black_text">

          Puedes ver las siguientes partidas:                                                                                                                                                                                                                                                                                    
      </p>

      <ul>
      {games.length === 0 ? (
        <li>No hay partidas </li>
      ) : (
        games.map((game) => (
          <li className="wrapper" key={game.id}>
            <p> Nombre: {game.name || JSON.stringify(game)} &nbsp;&nbsp;&nbsp;&nbsp; Estado: {game.state}</p>
          </li>
        ))
      )}
    </ul>




      
    </div>
  )
}

export default LandingPage



