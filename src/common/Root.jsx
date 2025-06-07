import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import './App.css'
import './Root.css'
import img_logo from '../assets/logo.png';

 function LandingPage() {

  const [games, setGames] = useState([]);


   useEffect(() => {
  fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
    .then((res) => res.json())
    .then((data) => setGames(data))
    .catch((err) => console.error(err));
}, []);



  return (
    
<div class="container">
  


  <div >
    <img src={img_logo} alt="Logo de Blokas" className="logo" />
    <p className= "black_text">
        ¡Bienvenido a Blokas!                                                                                                                                                                                                                                                                                      
    </p>
    <p className= "black_text">
        Registrate o inicia sesión para jugar                                                                                                                                                                                                                                                                                      
    </p>
    <div class="floating-icon dos">🎮👾</div>
  </div>







      
    </div>
  )
}

export default LandingPage



