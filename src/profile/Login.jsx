import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const { setUser } = useOutletContext()  //permite pasar datos desde el padre que renderiza un Putlet
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    console.log('handleLogin ejecutado')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/authentications/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      navigate('/game')

    } catch (error) {
      console.error('Login error:', error)
      alert('Credenciales inválidas o error de conexión')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  )
}
