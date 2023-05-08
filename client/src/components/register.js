import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useCookies} from 'react-cookie';

const Register = (props) => {

    const [auth, setAuth] = useState(null);
    const [cookie, setCookie] = useCookies(['token']);
    const username = useRef();
    const password = useRef();
    const [display, setDisplay] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();

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
                setDisplay(
                    <>
                        <form id="registerForm" onSubmit={registerForm}>
                            <label>
                                Username:
                                <input id="register-username" name="register-username" type="text" required={true}/>
                            </label>
                            <label>
                                Password:
                                <input id="register-password" name="register-passowrd" type="password" required={true}/>
                            </label>
                            <label>
                                Confirm Passowrd:
                                <input id="register-confirmPassword" name="register-confirmPassowrd"type="password" required={true}/>
                            </label>
                        </form>

                        <div className="registerForm-buttons">
                            <button id="registerButton" form="registerForm">Sign Up</button>
                            <a href="/login">Already have an account?</a>
                        </div>
                    </>
                )
            }
    
        }, [auth])

    // Handles Register Form Submit
    const registerForm = (e) => {
        e.preventDefault();

        let passwordInput = document.getElementById('register-password').value;
        let confirmPasswordInput = document.getElementById('register-confirmPassword').value;

        // If passwords match register user
        if (passwordInput === confirmPasswordInput) {

            const usernameInput = document.getElementById('register-username').value;

            username.current = usernameInput;
            password.current = passwordInput;

            const newUserInfo = {
                username: username.current,
                password: password.current
            }

            // Send user info to the backend
            fetch(`${props.serverURL}/register`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserInfo),
                mode: 'cors'
            })
            .then(res => res.json())
            .then(data => {

                // Username Already Exists
                if (data.success === false) {
                    setErrorMessage(data.message);
                }

                // If it was successful, redirect to login
                else if (data.success) {
                    navigate('/login', {state: {registeredMessage: 'Account Registered Successfully'}});
                }
            })
        }

        // If they dont match render error message
        else {
            setErrorMessage('Passwords Do Not Match');
        }
    }

    return (
        <div>
            {display}
            {errorMessage}
        </div>
    )
}
export default Register;