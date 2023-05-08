import { useEffect, useRef, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';

function App(props) {

  const [cookie, setCookie] = useCookies(['token']);
  const [auth, setAuth] = useState(null);
  const authedUser = useRef();
  const navigate = useNavigate();
  const [display, setDisplay] = useState();

  /* Calories */
  const [caloriesRemaining, setCaloriesRemaining] = useState(2500);
  const [breakfastCalories, setBreakfastCalories] = useState(0);
  const [lunchCalories, setLunchCalories] = useState(0);
  const [dinnerCalories, setDinnerCalories] = useState(0);
  const [snackCalories, setSnackCalories] = useState(0);

  /* Macros */
  const [carbCount, setCarbCount] = useState(0);
  const [fatCount, setFatCount] = useState(0);
  const [proteinCount, setProteinCount] = useState(0);

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

      // TODO: Loading
      if (auth === null) {
    
      }
  
      // Not Logged In redirect to login
      else if (auth === false) {
        navigate('/login')
      }
    }, [auth])


  return (
    <div className="mainPage">
      <Navbar serverURL={props.serverURL}/>
      {(auth)
        ?
        <div className='mainPage-container'>
          <div className='caloriesRemaining'>
            <h2>Calories Remaining: {caloriesRemaining}</h2>
          </div>

          <div className='mealOverview'>
            <p>Breakfast {breakfastCalories}</p>
          </div>

          <div className='mealOverview'>
            <p>Lunch {lunchCalories}</p>
          </div>

          <div className='mealOverview'>
            <p>Dinner {dinnerCalories}</p>
          </div>

          <div className='mealOverview'>
            <p>Snack {snackCalories}</p>
          </div>

          <div className='macroNutrient-stats'>
            <p>Carbs {carbCount}g</p>
            <p>Fat {fatCount}g</p>
            <p>Protein {proteinCount}g</p>
          </div>
        </div>
        :<></>
      }
    </div>
  );
}

export default App;
