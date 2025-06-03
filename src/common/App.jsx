// src/common/App.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import '../common/App.css'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <>

      <p>
          Bienvenido a Blokas                                                                                                                                                                                                                                                                                          
      </p>


      <Navbar user={user} logout={logout} />
      <main>
        <Outlet context={{ user, setUser }} />
      </main>




    </>
  )
}

export default App
