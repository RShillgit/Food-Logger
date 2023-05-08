import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/login";
import Register from "./components/register";
import NotFound from "./components/notFound";
import './App.css';

const RouteSwitch = () => {

    const serverURL = 'http://localhost:8000';

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App serverURL={serverURL}/>}/>
                <Route path="/login" element={<Login serverURL={serverURL}/>}/>
                <Route path="/register" element={<Register serverURL={serverURL}/>}/>
                <Route path="*" element={<NotFound serverURL={serverURL}/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;