import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [userType, setUserType] = useState('player') 
  const navigate = useNavigate()

  async function handleSignup(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('name_user', username)
    formData.append('user_type', userType)
    formData.append('avatar', avatar) 

    try {
      await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/authentications/signup`,
      formData
    )
      alert('Registro exitoso. Inicia sesión.')
      navigate('/login')

    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message)

    }
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
        <input
          type="file"
          accept="image/*"
          onChange={e => setAvatar(e.target.files[0])}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  )
}
