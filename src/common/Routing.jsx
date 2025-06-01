import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Instructions from '../game/Instructions'
import UserWelcome from '../profile/UserWelcome'
import App from './App'

function Routing(){
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/instructions'} element={<Instructions/>}/>
                <Route path={'/welcome'} element={<UserWelcome/>}/>
                <Route path={'/'} element={<App/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Routing