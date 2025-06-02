import { Link } from 'react-router-dom'
import './App.css'

export default function Navbar({ user, logout }) {
  return (
    <header className="nav-bar">
      <h1>🧩 Blokas</h1>
      <nav>
        <Link to="/instructions">Instrucciones</Link>
        <Link to="/about">Nosotros</Link>
        {user ? (
          <>
            <Link to="/game">Partida</Link>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Inicio Sesión</Link>
            <Link to="/signup">Registro</Link>
          </>
        )}
      </nav>
    </header>
  )
}
