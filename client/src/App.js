import { useEffect, useRef, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import NutritionFacts from './components/nutritionFacts';

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

  /* Food Search & Display */
  const [modalFoodDisplay, setModalFoodDisplay] = useState();
  const [foodSearchOptions, setFoodSearchOptions] = useState([]);
  const [searchedFoods, setSearchedFoods] = useState([])
  const [selectedFoodItem, setSelectedFoodItem] = useState();
  const [nutritionFactsDisplay, setNutritionFactsDisplay] = useState();

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

  // Anytime food search variables change set proper modal display
  useEffect(() => {

    // If there is a selected food item, display that item
    if (selectedFoodItem) {
      console.log(selectedFoodItem)
      setModalFoodDisplay(
        <div className='individualFoodItem'>

          <button onClick={() => {
            setSelectedFoodItem();
          }}>{"<"}</button>

          {selectedFoodItem.food.image
            ?<img src={selectedFoodItem.food.image} alt=''/>
            :<></>
          }
          
          <h1>{selectedFoodItem.food.label}</h1>

          {selectedFoodItem.measures.map((measure, i) => {
            return (
              <button value={measure.label} key={i} onClick={(e) => getNutritionFromMeasurement(e, measure.uri, selectedFoodItem.food.foodId)}>{measure.label}</button>
            )
          })}

          {nutritionFactsDisplay}
        </div>
      )
    }

    // Else if there is a list of searched foods display them
    else if (searchedFoods.length > 0) {
      console.log(searchedFoods)
      setModalFoodDisplay(
        <div className='searchedFoodItems'>
            {searchedFoods.map((foodItem, i) => {
            return (
              <div className='searchedFoodItem' key={i} onClick={() => selectAPIFoodItem(foodItem)}>
                
                <div className='left'>
                  {foodItem.food.image
                    ?<img src={foodItem.food.image} alt=""/>
                    :<></>
                  }
                  <p>{foodItem.food.label}</p>
                </div>
                
                <div className='right'>
                  <p>{Math.ceil(foodItem.food.nutrients.ENERC_KCAL)} Cals</p>
                </div>

              </div>
            )
          })}
        </div>
      )
    }

    // Else if there are food suggestions display them
    else if (foodSearchOptions.length > 0) {
      setModalFoodDisplay(
        <>
          <ul className='foodSuggestions' >
            {foodSearchOptions.map((option, i) => {
              return (
                <li key={i} onClick={() => selectFoodItemSuggestion(option)}>{option}</li>
              )
            })}
          </ul>
        </>
      )
    }

    else {
      setModalFoodDisplay();
    }

  }, [foodSearchOptions, searchedFoods, selectedFoodItem, nutritionFactsDisplay])

  // Opens Meal Associated Modal
  const openMealModal = (modalID) => {
    const selectedModal = document.getElementById(modalID);
    selectedModal.showModal();
  }

  // Closes Meal Assocaited Modal
  const closeMealModal = (modalID) => {

    setFoodSearchOptions([]);
    setSearchedFoods([]);
    setSelectedFoodItem();

    const selectedModal = document.getElementById(modalID);
    selectedModal.close();
  }

  // Autocomplete for food search
  const foodSearchAutocomplete = (e) => {
    fetch(`https://api.edamam.com/auto-complete?app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}&q=${e.target.value}`)
    .then(res => res.json())
    .then(data => {
      setFoodSearchOptions(data);
    })
    .catch(err => console.log(err))
  }

  // Selects food item suggestion
  const selectFoodItemSuggestion = (foodItemSuggestion) => {

    fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}&ingr=${foodItemSuggestion}&nutrition-type=cooking`)
    .then(res => res.json())
    .then(data => {

      // Set food search items to empty array
      setFoodSearchOptions([]);

      // Set searched foods
      if (data.hints.length > 0) {
        setSearchedFoods(data.hints)
      }
    })
    .catch(err => console.log(err))
  }

  // Selects a food item from the api to display
  const selectAPIFoodItem = (foodItem) => {
    setSelectedFoodItem(foodItem);
  }

  // Gets nutrition information based off measurement
  const getNutritionFromMeasurement = (e, uri, foodId) => {

    // Enable all buttons

    // Disable the clicked button

    // Get info from uri
    fetch(`https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "ingredients": [
          {
            "quantity": 1,
            "measureURI": uri,
            "foodId": foodId
          }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {

      console.log(data)
      // Display food label

      setNutritionFactsDisplay(<NutritionFacts facts={data} quantity={1} measurement={e.target.value}/>);

    })
    .catch(err => console.log(err))
  }

  return (
    <div className="App mainPage">
      <Navbar serverURL={props.serverURL}/>
      {(auth)
        ?
        <div className='mainPage-container'>

          <div className='caloriesRemaining'>
            <h2>Calories Remaining: {caloriesRemaining}</h2>
          </div>

          <div className='mealOverview' onClick={() => openMealModal('breakfastModal')}>
            <p>Breakfast {breakfastCalories}</p>
          </div>
          <dialog id='breakfastModal'>
            <button onClick={() => closeMealModal('breakfastModal')}>X</button>
            <h1>Breakfast</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {modalFoodDisplay}
          </dialog>

          <div className='mealOverview' onClick={() => openMealModal('lunchModal')}>
            <p>Lunch {lunchCalories}</p>
          </div>
          <dialog id='lunchModal'>
            <button onClick={() => closeMealModal('lunchModal')}>X</button>
            <h1>Lunch</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {modalFoodDisplay}
          </dialog>

          <div className='mealOverview' onClick={() => openMealModal('dinnerModal')}>
            <p>Dinner {dinnerCalories}</p>
          </div>
          <dialog id='dinnerModal'>
            <button onClick={() => closeMealModal('dinnerModal')}>X</button>
            <h1>Dinner</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {modalFoodDisplay}
          </dialog>

          <div className='mealOverview' onClick={() => openMealModal('snackModal')}>
            <p>Snack {snackCalories}</p>
          </div>
          <dialog id='snackModal'>
            <button onClick={() => closeMealModal('snackModal')}>X</button>
            <h1>Snack</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {modalFoodDisplay}
          </dialog>

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
