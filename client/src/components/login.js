import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {useCookies} from 'react-cookie';

const Login = (props) => {

    const [auth, setAuth] = useState(null);
    const [cookie, setCookie] = useCookies(['token']);
    const uName = useRef();
    const pWord = useRef();
    const {state} = useLocation();
    const navigate = useNavigate();
    const [registeredSuccessfullyMessage, setRegisteredSuccessfullyMessage] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [display, setDisplay] = useState();

    // On Mount
    useEffect(() => {
    // On page refresh, remove registeredMessage from state
      window.history.replaceState({}, document.title)
    }, [])

    // Anytime the cookie changes set the auth
    useEffect(() => {
        (async () => {
            // If there is a token present, run valdateUser function to see if its valid
            if(cookie.token) {
                const validToken = await props.validateUser(cookie.token);
                setAuth(validToken.auth)
            }
            else setAuth(false);
        })()
    }, [cookie])

    // Anytime the auth changes set the display
    useEffect(() => {

        // TODO: Loading
        if(auth === null) {

        }
        // If the user is authorized navigate them to the home page
        if (auth === true) {
            navigate('/')
        }
        else {
            // If sent from register route with registered successfully message
            if (state && state.registeredMessage) {
                setRegisteredSuccessfullyMessage(
                    <div className="registeredSuccessfully">
                        <p>{state.registeredMessage}</p>
                    </div>
                );
            }
            setDisplay(
                <>
                    <div className="loginPage-title">
                        <h1>Food Logger</h1>
                    </div>
                    <div className="loginForm-container">

                        <div className="loginForm-title">
                            <h2>Log In</h2>
                        </div>

                        {registeredSuccessfullyMessage}

                        <form id="loginForm" onSubmit={loginFormSubmit}>
                            <input type="text" name="username" id="usernameInput" placeholder="Username" required={true}/>
                            <input type="password" name="password" id="passwordInput" placeholder="Password" required={true}/>                       
                            <button id="loginButton">Log In</button>
                        </form>

                        <div className="login-buttons">
                            <button id="guestLoginButton">Log In As A Guest</button>
                            <p>·</p>
                            <a id="registerLink" href='/register'> Sign Up</a>                          
                        </div>
                    </div>
                </>
            )
        }

    }, [auth])

    // Handles login form submission 
    const loginFormSubmit = (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('usernameInput');
        const passwordInput = document.getElementById('passwordInput');

        uName.current = usernameInput.value;
        pWord.current = passwordInput.value;
        
        const username = uName.current;
        const password = pWord.current;
        
        const login_information = {username, password};

        // Use this login info to send post request
        loginRequest(login_information);
    }

    // POST request to login route
    const loginRequest = (login_information) => {

        fetch(`${props.serverURL}/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            mode: 'cors',
            body: JSON.stringify(login_information)
        })
        .then((res) => res.json())
        .then((data) => {

            // If login credentials were INCORRECT render error message
            if (data.success === false) {
                setErrorMessage(
                    <div className="errorMessage">
                        <p>{data.error_message}</p>
                    </div>
                )
            }
            // If login credentials were CORRECT set cookie
            if (data.success) {
                // Get the cookie from the backend and set it in the browser
                setCookie('token', data.token, {path: '/'})
            }
        })
    }

    return (
        <div className="loginPage">
            {display}
            {errorMessage}
        </div>
    )
}
export default Login;