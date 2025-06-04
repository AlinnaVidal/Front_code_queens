import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'  
import Navbar from './Navbar'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const navigate = useNavigate()  

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/') 
  }

  return (
    <div className="body">
      <Navbar user={user} logout={logout} />
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  )
}

export default App
