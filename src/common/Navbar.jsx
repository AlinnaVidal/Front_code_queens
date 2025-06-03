import { Link } from 'react-router-dom'
import './App.css'

export default function Navbar({ user, logout }) {
  return (
    <header className="nav-bar">
      <h1>
        <Link to="/" className="logo-link">🧩 Blokas</Link>
      </h1>
      <nav>
        <Link to="/instructions" className="normal-link">Instrucciones</Link>
        <Link to="/about" className="normal-link">Nosotros</Link>
        {user ? (
          <>
            <Link to="/game" className="normal-link">Partida</Link>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="normal-link">Inicio Sesión</Link>
            <Link to="/signup" className="normal-link">Registro</Link>
          </>
        )}
      </nav>
    </header>
  )
}


