import { useEffect, useRef, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function App(props) {

  const [cookie, setCookie] = useCookies(['token']);
  const [auth, setAuth] = useState(null);
  const authedUser = useRef();
  const navigate = useNavigate();
  const [display, setDisplay] = useState();

  // Anytime the cookie changes, set auth
  useEffect(() => {

    (async () => {
      // If there is a token present, run checkToken function to see if its valid
      if(cookie.token) {
          const validateUserResponse = await props.validateUser(cookie.token);

          // If the resposne is successful
          if (validateUserResponse.success === true) {
            authedUser.current = validateUserResponse.currentUser
            setAuth(validateUserResponse.auth)
          }
      }
      else setAuth(false);
    })()

  }, [cookie])

    // Anytime auth changes, set display
    useEffect(() => {

      // Loading
      if (auth === null) {
    
      }
  
      // Not Logged In redirect to login
      else if (auth === false) {
        navigate('/login')
      }
    }, [auth])


  return (
    <div className="App">
      <h1>Food logger</h1>
    </div>
  );
}

export default App;
