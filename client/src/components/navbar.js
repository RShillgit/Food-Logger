import { useCookies } from 'react-cookie';
import '../styles/navbar.css';

const Navbar = (props) => {

    const [cookie, setCookie, removeCookie] = useCookies(['token']);

    // Log user out
    const userLogout = (e) => {
        e.preventDefault();
        fetch(`${props.serverURL}/logout`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                removeCookie('token', {path: '/'});
            }
        })
        .catch(err => console.log(err))
    } 

    return (
        <div className="navbar">
            <button id='logoutButton' onClick={userLogout}>Logout</button>
        </div>
    )

}
export default Navbar;