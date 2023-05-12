import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/login";
import Register from "./components/register";
import NotFound from "./components/notFound";
import './App.css';

const RouteSwitch = () => {

    const serverURL = 'https://woozy-carpenter-production-7d1c.up.railway.app'; // http://localhost:8000

    const validateUser = (token) => {
        return fetch(serverURL, {
            headers: {
                Authorization: token
            },
        })
        .then(res => {
            const data = res.json()
            return (res.status, data);
        })  
        .catch(err => {return false})
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App serverURL={serverURL} validateUser={validateUser}/>}/>
                <Route path="/login" element={<Login serverURL={serverURL} validateUser={validateUser}/>}/>
                <Route path="/register" element={<Register serverURL={serverURL} validateUser={validateUser}/>}/>
                <Route path="*" element={<NotFound serverURL={serverURL} validateUser={validateUser}/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;