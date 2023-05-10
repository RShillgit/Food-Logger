import { useEffect, useId, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import NutritionFacts from './components/nutritionFacts';
import { v4 as uuidv4 } from 'uuid'

function App(props) {

  const [cookie, setCookie] = useCookies(['token']);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState();
  const navigate = useNavigate();

  /* Food Log */
  const [logDate, setLogDate] = useState();
  const [foodLog, setFoodLog] = useState();

  /* Calories */
  const [caloriesRemaining, setCaloriesRemaining] = useState(2500);
  const [breakfastCalories, setBreakfastCalories] = useState(0);
  const [lunchCalories, setLunchCalories] = useState(0);
  const [dinnerCalories, setDinnerCalories] = useState(0);
  const [snackCalories, setSnackCalories] = useState(0);

  const [calorieEditing, setCalorieEditing] = useState(false);
  const [dailyCalorieBudget, setDailyCalorieBudget] = useState(0)

  /* Macros */
  const [carbCount, setCarbCount] = useState(0);
  const [fatCount, setFatCount] = useState(0);
  const [proteinCount, setProteinCount] = useState(0);

  /* Food Search & Display */
  const [selectedMeal, setSelectedMeal] = useState('');
  const [modalFoodDisplay, setModalFoodDisplay] = useState();
  const [foodSearchOptions, setFoodSearchOptions] = useState([]);
  const [searchedFoods, setSearchedFoods] = useState([])
  const [selectedFoodItem, setSelectedFoodItem] = useState();
  const [nutritionFactsDisplay, setNutritionFactsDisplay] = useState();
  const [editingFoodItem, setEditingFoodItem] = useState();

  // Anytime the cookie changes, set auth
  useEffect(() => {

    (async () => {
      // If there is a token present, run checkToken function to see if its valid
      if(cookie.token) {
          const validateUserResponse = await props.validateUser(cookie.token);

          // If the resposne is successful
          if (validateUserResponse.success === true) {
            setUser(validateUserResponse.currentUser);
            setAuth(validateUserResponse.auth)

            // Set log date to current date
            const todaysDate = new Date();
            let day = todaysDate.getDate();
            let month = todaysDate.getMonth() + 1;
            let year = todaysDate.getFullYear();
            if (day < 10) {
              day = `0${day}`;
            }
            if (month < 10) {
              month = `0${month}`;
            }
            const todaysDateFormatted = `${year}-${month}-${day}`;
            setLogDate(todaysDateFormatted);
          }
      }
      else setAuth(false);
    })()

  }, [cookie])

  // On date change
  useEffect(() => {

    if (user) {

      const dateParts = logDate.split('-');
      const logYear = Number(dateParts[0]);
      const logMonth = Number(dateParts[1] - 1);
      const logDay = Number(dateParts[2]);

      // Check if user has a food log for this log date
      const dateExists = user.food_logs.filter(log => {

        const converted = new Date(log.date)
        const year = converted.getFullYear();
        const month = converted.getMonth();
        const day = converted.getDate();

        if (year === logYear && month === logMonth && day === logDay) {
          return log;
        }
        return null;
      })

      // If they do set the food log to this log
      if (dateExists.length > 0) {
        setFoodLog(dateExists[0])
      }
    }

  }, [logDate])

  // On food log change
  useEffect(() => {

    // If a food object exists render it
    if(foodLog) {
    }

    // Else render normal display
    else {
    }

  }, [foodLog])

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

  // Set proper modal display
  useEffect(() => {

    // If there is an editing food item, display edit item modal
    if(editingFoodItem) {
      console.log(editingFoodItem)

      // If there is no nutrtition facts generate an initial one
      if(!nutritionFactsDisplay) {
        getInitialNutrtitionFacts(editingFoodItem.foodId, editingFoodItem.measures, editingFoodItem.serving_number, editingFoodItem.serving_units,  editingFoodItem.initial_measures_uri)
      }

      setModalFoodDisplay(
        <div className='editFoodItem'>

          <button onClick={() => {
            setEditingFoodItem();
            setNutritionFactsDisplay();
          }}>{"<"}</button>

          {editingFoodItem.image
            ?<img src={editingFoodItem.image} alt=''/>
            :<></>
          }
          
          <h1>{editingFoodItem.label}</h1>

          {editingFoodItem.measures.map((measure, i) => {
            return (
              <button className='foodUnitSelect' value={measure.label} key={i} 
                onClick={(e) => getNutritionFromMeasurement(e, measure.uri, editingFoodItem.foodId, editingFoodItem.serving_number, true)}>
                {measure.label}
              </button>
            )
          })}

          {nutritionFactsDisplay}
        </div>
      )
    }

    // If there is a selected food item, display that item
    else if (selectedFoodItem) {

      // If there is no nutrtition facts generate an initial one
      if(!nutritionFactsDisplay) {
        console.log(selectedFoodItem)
        getInitialNutrtitionFacts(selectedFoodItem.food.foodId, selectedFoodItem.measures, 1, selectedFoodItem.measures[0].label,  selectedFoodItem.measures[0].uri)
      }

      setModalFoodDisplay(
        <div className='individualFoodItem'>

          <button onClick={() => {
            setSelectedFoodItem();
            setNutritionFactsDisplay();
          }}>{"<"}</button>

          {selectedFoodItem.food.image
            ?<img src={selectedFoodItem.food.image} alt=''/>
            :<></>
          }
          
          <h1>{selectedFoodItem.food.label}</h1>

          {selectedFoodItem.measures.map((measure, i) => {
            return (
              <button className='foodUnitSelect' value={measure.label} key={i} 
                onClick={(e) => getNutritionFromMeasurement(e, measure.uri, selectedFoodItem.food.foodId, 1, false)}>
                {measure.label}
              </button>
            )
          })}

          {nutritionFactsDisplay}
        </div>
      )
    }

    // Else if there is a list of searched foods display them
    else if (searchedFoods.length > 0) {
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
                  <p>{Math.round(foodItem.food.nutrients.ENERC_KCAL)} Cals</p>
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

  }, [foodSearchOptions, searchedFoods, selectedFoodItem, nutritionFactsDisplay, editingFoodItem])

  // Calculates calories for calories remaining and each meal
  const calculateCalories = (identifier) => {

    if (foodLog) {

      let calculatedCals;

      if (identifier === 'remaining') {
        const breakfastCals = foodLog.breakfast.reduce((acc, obj) => acc + obj.total_calories, 0);
        const lunchCals = foodLog.lunch.reduce((acc, obj) => acc + obj.total_calories, 0);
        const dinnerCals = foodLog.dinner.reduce((acc, obj) => acc + obj.total_calories, 0);
        const snackCals = foodLog.snack.reduce((acc, obj) => acc + obj.total_calories, 0);

        calculatedCals = (user.calorie_budget - breakfastCals - lunchCals - dinnerCals - snackCals);
      }
      else if (identifier === 'breakfast') {
        calculatedCals = foodLog.breakfast.reduce((acc, obj) => acc + obj.total_calories, 0);
      }
      else if (identifier === 'lunch') {
        calculatedCals = foodLog.lunch.reduce((acc, obj) => acc + obj.total_calories, 0);
      }
      else if (identifier === 'dinner') {
        calculatedCals = foodLog.dinner.reduce((acc, obj) => acc + obj.total_calories, 0);
      }
      else if (identifier === 'snack') {
        calculatedCals = foodLog.snack.reduce((acc, obj) => acc + obj.total_calories, 0);
      }

      return (calculatedCals);
    }
  }

  // Opens Meal Associated Modal
  const openMealModal = (modalID) => {
    const selectedModal = document.getElementById(modalID);

    if(modalID === 'breakfastModal') setSelectedMeal('breakfast');
    else if(modalID === 'lunchModal') setSelectedMeal('lunch');
    else if(modalID === 'dinnerModal') setSelectedMeal('dinner');
    else if(modalID === 'snackModal') setSelectedMeal('snack');

    selectedModal.showModal();
  }

  // Closes Meal Assocaited Modal
  const closeMealModal = (modalID) => {

    setFoodSearchOptions([]);
    setSearchedFoods([]);
    setSelectedFoodItem();
    setNutritionFactsDisplay();
    setEditingFoodItem();

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

  // Gets initial nutrtion facts
  const getInitialNutrtitionFacts = (foodID, measures, servings, units, initialURI) => {

    // Get info from uri
    fetch(`https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "ingredients": [
          {
            "quantity": Number(servings),
            "measureURI": initialURI,
            "foodId": foodID
          }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {

      console.log(data)

      // Display food label
      setNutritionFactsDisplay(generateNutritionFacts(data, initialURI, units, servings, true));
    })
    .catch(err => console.log(err))

  }

  // Gets nutrition information based off measurement
  const getNutritionFromMeasurement = (e, uri, foodId, quantity, editingStatus) => {

    // Enable all buttons
    const foodUnitButtons = document.querySelectorAll('.foodUnitSelect');
    foodUnitButtons.forEach(button => button.disabled = false);

    // Disable the clicked button
    e.target.disabled = true;

    // Get info from uri
    fetch(`https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "ingredients": [
          {
            "quantity": Number(quantity),
            "measureURI": uri,
            "foodId": foodId
          }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      // Display food label
      setNutritionFactsDisplay(generateNutritionFacts(data, uri, e.target.value, quantity, editingStatus));

    })
    .catch(err => console.log(err))
  }

  // Generates Nutrition Facts 
  const generateNutritionFacts = (facts, uri, measurement, serving_number, editingStatus) => {
    return (<NutritionFacts facts={facts} uri={uri} serving_number={Number(serving_number)} measurement={measurement} logFoodItem={logFoodItem} updateFoodItem={updateFoodItem} editingStatus={editingStatus}/>);
  }

  // Logs food item
  const logFoodItem = (stats) => {

    const foodItem = {
      _id: uuidv4(),
      foodId : selectedFoodItem.food.foodId,
      label: selectedFoodItem.food.label,
      image: selectedFoodItem.food.image,
      measures: selectedFoodItem.measures,
      initial_measures_uri: stats.uri,
      total_calories: stats.calories,
      total_fats: stats.fats,
      total_carbs: stats.carbs,
      total_proteins: stats.proteins,
      serving_number: stats.quantity,
      serving_units: stats.units
    }

    fetch(`${props.serverURL}/logs/${foodLog._id}`, {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        Authorization: cookie.token
      },
      mode: 'cors',
      body: JSON.stringify(
        {
          meal: selectedMeal,
          foodItem
        }
      )
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      if (data.success) {
        setFoodLog(data.updatedFoodLog);
        setSelectedFoodItem();
        setFoodSearchOptions([]);
        setSearchedFoods([]);
        setNutritionFactsDisplay();
        setEditingFoodItem();
      }
    })
    .catch(err => console.log(err))
  }

  // Updates food item
  const updateFoodItem = (stats) => {
    console.log(stats)
  }

  // TODO: Go back a day
  const previousDay = () => {
    
    const dateSplit = logDate.split('-');
    const day = dateSplit[2];
    let newDay = Number(day) - 1;

    // Previous day === the last day of the previous month
    if (newDay === 0) {
      console.log('Format date to last day of previous month');
    }
    else if (newDay < 10) {
      newDay = `0${newDay}`;
    }
    setLogDate(`${dateSplit[0]}-${dateSplit[1]}-${newDay}`)
  }

  // TODO: Go forward a day
  const nextDay = () => {
    const dateSplit = logDate.split('-');
    const day = dateSplit[2];
    let newDay = Number(day) + 1;

    // If next day === the first day of the next month

    if (newDay < 10) {
      newDay = `0${newDay}`;
    }
    setLogDate(`${dateSplit[0]}-${dateSplit[1]}-${newDay}`)
  }

  // Deletes an existing food item
  const deleteFoodItem = (meal, item) => {

    fetch(`${props.serverURL}/logs/${foodLog._id}/${meal}/${item._id}/${item.foodId}`, {
      method: 'DELETE',
      headers: { 
        "Content-Type": "application/json",
        Authorization: cookie.token
      },
      mode: 'cors',
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setFoodLog(data.newFoodLog)
      }
    })
    .catch(err => console.log(err))
  }

  // Edits daily calorie budget
  const editCalorieBudget = (e) => {
    e.preventDefault();

    console.log(dailyCalorieBudget)

    fetch(`${props.serverURL}/users/${user._id}`, {
      method: 'PUT',
      headers: { 
        "Content-Type": "application/json",
        Authorization: cookie.token
      },
      mode: 'cors',
      body: JSON.stringify(
        {
          editedCalories: dailyCalorieBudget
        }
      )
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      if (data.success) {
        setUser(data.updatedUser)
        setCalorieEditing(false)
      }
    })
    .catch(err => console.log(err))
  }

  // Edit a food item
  const editExistingFoodItem = (foodItem) => {
    setEditingFoodItem(foodItem)
  }

  // Displays existing foods based on the selected meal
  const displayExistingFoods = (meal) => {

    if (meal === 'breakfast') {
      return (
        <div className='existingFoods'>
          {(foodLog && foodLog.breakfast.length > 0)
            ?
            <>
              {foodLog.breakfast.map(food => {
                return (
                  <div className='individualExistingFood' key={uuidv4()}>
                    <div className='left' onClick={() => editExistingFoodItem(food)}>
                      {food.image
                        ? <img src={food.image} alt=""/>
                        :<></>
                      }
                      <p>{food.label}</p>
                    </div>
                    <div className='right'>
                      <p>{food.total_calories} cals</p>
                      <button onClick={() => deleteFoodItem(meal, food)}>X</button>
                    </div>
                  </div>
                )
              })}
            </>
            :
            <>
              <h3>No foods to display</h3>
            </>
          }
        </div>
      )
    }
    else if (meal === 'lunch') {
      return (
        <div className='existingFoods'>
          {(foodLog && foodLog.lunch.length > 0)
            ?
            <>
              {foodLog.lunch.map(food => {
                return (
                  <div className='individualExistingFood' key={uuidv4()}>
                    <div className='left'>
                      {food.image
                        ? <img src={food.image} alt=""/>
                        :<></>
                      }
                      <p>{food.label}</p>
                    </div>
                    <div className='right'>
                      <p>{food.total_calories} cals</p>
                      <button onClick={() => deleteFoodItem(meal, food)}>X</button>
                    </div>
                  </div>
                )
              })}
            </>
            :
            <>
              <h3>No foods to display</h3>
            </>
          }
        </div>
      )
    }
    else if (meal === 'dinner') {
      return (
        <div className='existingFoods'>
          {(foodLog && foodLog.dinner.length > 0)
            ?
            <>
              {foodLog.dinner.map(food => {
                return (
                  <div className='individualExistingFood' key={uuidv4()}>
                    <div className='left'>
                      {food.image
                        ? <img src={food.image} alt=""/>
                        :<></>
                      }
                      <p>{food.label}</p>
                    </div>
                    <div className='right'>
                      <p>{food.total_calories} cals</p>
                      <button onClick={() => deleteFoodItem(meal, food)}>X</button>
                    </div>
                  </div>
                )
              })}             
            </>
            :
            <>
              <h3>No foods to display</h3>
            </>
          }
        </div>
      )
    }
    else if (meal === 'snack') {
      return (
        <div className='existingFoods'>
          {(foodLog && foodLog.snack.length > 0)
            ?
            <>
              {foodLog.snack.map(food => {
                return (
                  <div className='individualExistingFood' key={uuidv4()}>
                    <div className='left'>
                      {food.image
                        ? <img src={food.image} alt=""/>
                        :<></>
                      }
                      <p>{food.label}</p>
                    </div>
                    <div className='right'>
                      <p>{food.total_calories} cals</p>
                      <button onClick={() => deleteFoodItem(meal, food)}>X</button>
                    </div>
                  </div>
                )
              })}  
            </>
            :
            <>
              <h3>No foods to display</h3>
            </>
          }
        </div>
      )
    }
  }

  return (
    <div className="App mainPage">
      <Navbar serverURL={props.serverURL}/>
      {(auth)
        ?
        <div className='mainPage-container'>

          <div className='date-navigation'>
            <button onClick={previousDay}>{"<"}</button>
            <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}/>
            <button onClick={nextDay}>{">"}</button>
          </div>

          <div className='caloriesRemaining'>
            {(calorieEditing)
              ?
              <>
                <form id='editCalorieBudget' onSubmit={editCalorieBudget}>
                  <input type="number" value={dailyCalorieBudget} onChange={(e) => setDailyCalorieBudget(e.target.value)} min={1}/>
                </form>
                <button onClick={() => setCalorieEditing(false)}>Cancel</button>
                <button form='editCalorieBudget' type='submit'>Edit</button>
              </>
              :
              <>
                <h2>Calories Remaining: {calculateCalories('remaining')}</h2>
                <button onClick={() => {
                  setDailyCalorieBudget(calculateCalories('remaining'))
                  setCalorieEditing(true)
                }}>Edit</button>
              </>
            }
            
          </div>

          <div className='mealOverview' onClick={() => openMealModal('breakfastModal')}>
            <p>Breakfast {calculateCalories('breakfast')} cals</p>
          </div>
          <dialog id='breakfastModal'>
            <button onClick={() => closeMealModal('breakfastModal')}>X</button>
            <h1>Breakfast</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {displayExistingFoods('breakfast')}
            {modalFoodDisplay}
          </dialog>

          <div className='mealOverview' onClick={() => openMealModal('lunchModal')}>
            <p>Lunch {calculateCalories('lunch')} cals</p>
          </div>
          <dialog id='lunchModal'>
            <button onClick={() => closeMealModal('lunchModal')}>X</button>
            <h1>Lunch</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {displayExistingFoods('lunch')}
            {modalFoodDisplay}
          </dialog>

          <div className='mealOverview' onClick={() => openMealModal('dinnerModal')}>
            <p>Dinner {calculateCalories('dinner')} cals</p>
          </div>
          <dialog id='dinnerModal'>
            <button onClick={() => closeMealModal('dinnerModal')}>X</button>
            <h1>Dinner</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {displayExistingFoods('dinner')}
            {modalFoodDisplay}
          </dialog>

          <div className='mealOverview' onClick={() => openMealModal('snackModal')}>
            <p>Snack {calculateCalories('snack')} cals</p>
          </div>
          <dialog id='snackModal'>
            <button onClick={() => closeMealModal('snackModal')}>X</button>
            <h1>Snack</h1>
            <input type="text" placeholder="Search a food" onChange={foodSearchAutocomplete} />
            {displayExistingFoods('snack')}
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
