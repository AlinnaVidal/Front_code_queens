import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import UserWelcome from '../profile/UserWelcome'
import Routing from './Routing'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
)


export default function LandingPage2() {
  return (
    <div className="about-us"> 
      <h2>Sobre Nosotras</h2>
      
      <p>
        Somos un equipo de estudiantes de Ingeniería en Computación desarrollando el juego web Blokas como parte del curso de Tecnología y Aplicaciones Web.
      </p>
      <h3>Integrantes</h3>
      <ul>
        <li>Valentina Juri</li>
        <li>Florencia Schiappacasse</li>
        <li>Alinna Vidal</li>

      </ul>
      
    </div>
  )
}

