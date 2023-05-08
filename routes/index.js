var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { genPassword, validatePassword } = require('../utils/passwordUtils');
const jwtUtils = require('../utils/jwtUtils');

/* GET home page. */
router.get('/', 
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
    const token = req.headers.authorization;
    const userToken = jwtUtils.jwtVerify(token);
    
    return res.status(200).json({success: true, auth: req.isAuthenticated(), userToken: userToken, currentUser: req.user});
  },
  (err, req, res) => {
    return res.status(401).json({success: false, err, auth: req.isAuthenticated()});
  }
);

// Register User
router.post('/register', (req, res) => {

  // Check if username already exists
  User.findOne({ username: req.body.username })
  .then((user) => {

    // Username already exists
    if (user) {
      return res.status(500).json({success: false, message:'Username already exists'});
    }

    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // Create user with salt and hash
    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
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

// JWT Login Request
router.post('/login', (req, res) => {

    // Look for user in DB
    User.findOne({ username: req.body.username })
    .then((user) => {

      // If no user send error
      if (!user) {
        return res.status(500).json({success: false, error_message: "User not found."});
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
        return res.status(500).json({success: false, error_message: "The password you entered is incorrect."})
      }
    })
})

module.exports = router;
