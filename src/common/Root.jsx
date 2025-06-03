import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import './App.css'





 function LandingPage() {
  return (
    <div className="about-us"> 
      <p className= "black_text">
          ¡Bienvenido a Blokas!                                                                                                                                                                                                                                                                                      
      </p>

      <p className= "black_text">
          Registrate o inicia sesión para jugar                                                                                                                                                                                                                                                                                      
      </p>

      <p className= "black_text">

          Puedes ver las siguientes partidas en proceso:                                                                                                                                                                                                                                                                                    
      </p>
      
    </div>
  )
}

export default LandingPage



