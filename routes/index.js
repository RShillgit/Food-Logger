var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const FoodLog = require('../models/foodLog');
const { genPassword, validatePassword } = require('../utils/passwordUtils');
const jwtUtils = require('../utils/jwtUtils');
const crypto = require('crypto');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://food-logger-production.up.railway.app'); // http://localhost:3000
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*'); // X-Requested-With,content-type
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/* GET home page. */
router.get('/', 
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
    const token = req.headers.authorization;
    const userToken = jwtUtils.jwtVerify(token);

    // Populate User
    User.findById(req.user._id)
    .populate('food_logs')
    .then(populatedUser => {
      return res.status(200).json({success: true, auth: req.isAuthenticated(), userToken: userToken, currentUser: populatedUser});
    })
    .catch(err => {
      return res.status(500).json({success: false, err: err, auth: req.isAuthenticated()});
    })
  },
  (err, req, res) => {
    return res.status(500).json({success: false, err: err, auth: req.isAuthenticated()});
  }
);

// Register User
router.post('/register', (req, res) => {

  // Check if username already exists
  User.findOne({ username: req.body.username })
  .then((user) => {

    // Username already exists
    if (user) {
      return res.status(500).json({success: false, message:'Username already exists!'});
    }

    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // Create user with salt and hash
    const newUser = new User({
        username: req.body.username,
        calorie_budget: 2000,
        hash: hash,
        salt: salt,
        food_logs: [],
    })
    newUser.save()
      .then(result => {
        return res.status(200).json({success: true, result: result})
      })
      .catch(err => {
        return res.status(500).json({success: false, error: err});
      })
  })
  .catch(err => {
    return res.status(500).json({success: false, error: err})
  })
})

// JWT Login 
router.post('/login', (req, res) => {

    // Look for user in DB
    User.findOne({ username: req.body.username })
    .then((user) => {

      // If no user send error
      if (!user) {
        return res.status(500).json({success: false, error_message: "User not found!"});
      }

      // Check if password is valid
      const isValid = validatePassword(req.body.password, user.hash, user.salt);

      // If password is valid send success
      if (isValid) {
        const tokenObject = jwtUtils.issueJWT(user);

        res.cookie('token', tokenObject.token); // Send token as cookie for the front end to use
        return res.status(200).json({success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires});
      } 
      // If password is invalid send error message
      else {
        return res.status(500).json({success: false, error_message: "Incorrect username/password combination!"})
      }
    })
})

// Log user out
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.clearCookie("token"); // Delete token from cookies
    res.status(200).json({success: true});
  });
})

// Guest login
router.get('/guest', (req, res, next) => {

  // Run function that gets and tests random strings for valid credentials
  testRandomString()

    // Use valid string to register new user
    .then(validString => {

      // Salt and hash
      const saltHash = genPassword(validString);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      // Create user with these credentials
      const newUser = new User({
          username: validString,
          calorie_budget: 2000,
          hash: hash,
          salt: salt,
          food_logs: []
      })

      newUser.save()
      .then(result => {
        return res.status(200).json({success: true, result: result})
      })
      .catch(err => res.status(500).json({success: false, error: err}))
    })
})

// Create new food log
router.post('/logs',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {

    const newLog = new FoodLog({
      parentUser: req.user._id,
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
      date: req.body.date
    })
    newLog.save()
    .then(newFoodLog => {

      const usersFoodLogs = req.user.food_logs;
      usersFoodLogs.push(newFoodLog);

      // Add food log to users food_logs array
      User.findByIdAndUpdate(req.user._id,
        {
          food_logs: usersFoodLogs
        },
        {new: true}  
      )
      .populate('food_logs')
      .then(updatedUser => {
        return res.status(200).json({success: true, auth: req.isAuthenticated(), updatedUser: updatedUser, newFoodLog: newFoodLog})
      })
      .catch(err => {
        return res.status(500).json({success: false, auth: req.isAuthenticated(), err: err});
      })
    })
    .catch(err => {
      return res.status(500).json({success: false, auth: req.isAuthenticated(), err: err});
    })
  },
  (req, res) => {
    return res.status(401).json({success: false, error: 'Unauthenticated', auth: req.isAuthenticated()});
  }
)

// Log food item
router.post('/logs/:logID', 
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {

    // Get the food log
    FoodLog.findById(req.params.logID)
    .then((log) => {

      // Add food to meal array
      let mealArray;
      if (req.body.meal === 'breakfast') mealArray = log.breakfast;
      else if (req.body.meal === 'lunch') mealArray = log.lunch;
      else if (req.body.meal === 'dinner') mealArray = log.dinner;
      else if (req.body.meal === 'snack') mealArray = log.snack;
      mealArray.push(req.body.foodItem)

      // Update food log
      FoodLog.findByIdAndUpdate(req.params.logID, 
        {
          [req.body.meal]: mealArray 
        },
        {new: true}
      )
      .then(updatedFoodLog => {

        // Get the user
        User.findById(req.user._id)
        .populate('food_logs')
        .then(updatedUser => {
          return res.status(200).json({success: true, auth: req.isAuthenticated(), updatedFoodLog: updatedFoodLog, updatedUser: updatedUser});
        })
        .catch(err => {
          return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
        })
      })
      .catch(err => {
        return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
      })
    })
    .catch(err => {
      return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
    })
  },
  (req, res) => {
    return res.status(401).json({success: false, error: 'Unauthenticated', auth: req.isAuthenticated()});
  }
)

// Update food item
router.put('/logs/:logID',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {

    // Get the food log
    FoodLog.findById(req.params.logID)
    .then((log) => {

      // Get the correct meal array
      let mealArray;
      if (req.body.meal === 'breakfast') mealArray = log.breakfast;
      else if (req.body.meal === 'lunch') mealArray = log.lunch;
      else if (req.body.meal === 'dinner') mealArray = log.dinner;
      else if (req.body.meal === 'snack') mealArray = log.snack;

      // Find and update the food item
      const foodIndex = mealArray.findIndex(item => item.foodId === req.body.foodId && item._id === req.body._id)
      const foodItem = mealArray[foodIndex];

      foodItem.initial_measures_uri = req.body.updates.initial_measures_uri;
      foodItem.total_calories = req.body.updates.total_calories
      foodItem.total_fats = req.body.updates.total_fats
      foodItem.total_carbs = req.body.updates.total_carbs
      foodItem.total_proteins = req.body.updates.total_proteins
      foodItem.serving_number = req.body.updates.serving_number
      foodItem.serving_units = req.body.updates.serving_units

      // Update the food log
      FoodLog.findByIdAndUpdate(req.params.logID,
        {
          [req.body.meal]: mealArray
        }, 
        {new: true}
      )
      .then(updatedFoodLog => {     

        // Get the user
        User.findById(req.user._id)
        .populate('food_logs')
        .then(updatedUser => {
          return res.status(200).json({success: true, auth: req.isAuthenticated(), updatedFoodLog: updatedFoodLog, updatedUser: updatedUser});
        })
        .catch(err => {
          return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
        })
      })
      .catch(err => {
        return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
      })
    })
    .catch(err => {
      return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
    })
  },
  (req, res) => {
    return res.status(401).json({success: false, error: 'Unauthenticated', auth: req.isAuthenticated()});
  }
)

// Delete food item from a meal
router.delete('/logs/:logID/:meal/:uniqueID/:foodID',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {

    // Find the log
    FoodLog.findById(req.params.logID)
    .then(log => {

      // Get associated meal
      let mealArray;
      if(req.params.meal === 'breakfast') mealArray = log.breakfast;
      else if(req.params.meal === 'lunch') mealArray = log.lunch;
      else if(req.params.meal === 'dinner') mealArray = log.dinner;
      else if(req.params.meal === 'snack') mealArray = log.snack;
      else return res.status(500).json({success: false, auth: req.isAuthenticated()});

      // Remove food item from the meal array
      const newMealArray = mealArray.filter(foodItem => {
        return foodItem._id !== req.params.uniqueID && foodItem.foodId !== req.params.foodID
      })

      // Update food log
      FoodLog.findByIdAndUpdate(req.params.logID,
        {
          [req.params.meal]: newMealArray
        },
        {new: true}  
      )
      .then(newFoodLog => {

        //Get the user
        User.findById(req.user._id)
        .populate('food_logs')
        .then(updatedUser => {
          return res.status(200).json({success: true, newFoodLog: newFoodLog, updatedUser: updatedUser, auth: req.isAuthenticated()});
        })
        .catch(err => {
          return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
        })
      })
      .catch(err => {
        return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
      })
    })
    .catch(err => {
      return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
    })

  },
  (req, res) => {
    return res.status(401).json({success: false, error: 'Unauthenticated', auth: req.isAuthenticated()});
  }
)

// Update daily calorie budget
router.put('/users/:userID',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {

    // Find user
    User.findByIdAndUpdate(req.user._id,
      {
        calorie_budget: req.body.editedCalories
      }, 
      {new: true}
    )
    .then(updatedUser => {
      return res.status(200).json({success: true, updatedUser: updatedUser, auth: req.isAuthenticated()});
    })
    .catch(err => {
      return res.status(500).json({success: false, error: err, auth: req.isAuthenticated()});
    })

  },
  (req, res) => {
    return res.status(401).json({success: false, error: 'Unauthenticated', auth: req.isAuthenticated()});
  }
)

// Function that returns a random string
function randomString() {
  const randomString = crypto.randomBytes(20).toString('hex');
  return randomString;
}

// Tests if the random string is an available username or not
async function testRandomString() {

  const randomCredentials = randomString();

  return await User.findOne({ username: randomCredentials })
  .then(user => {

    // If a user with these credentials exists rerun the function
    if (user) {
      return testRandomString();
    }
    // If there is no user with these credentials, return the random string
    else {
      return randomCredentials;
    }
  })
}

module.exports = router;
