const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Jokes = require('../jokes/jokes-model');
const db = require('../../data/dbConfig');
const JWT_SECRET = require('../secrets');
const {validateUser} = require('./auth-middleware')


router.post('/register', validateUser, (req, res, next) => {//add middleware for usernamechecking here
  const {username, password} = req.body;

  const hash = bcrypt.hashSync(password, 8);

  Jokes.add({ username, password: hash})
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', validateUser, async (req, res) => {//3 and 4 on the requirements will need middleware
  const user = await db('users').where('username', req.body.username).first()
  if(!user){
    res.json({message: "invalid credentials"})
  } else {
    if (bcrypt.compare(user.password, req.body.password)) {
      const token = buildToken(user);
      res.json({
        "message": `welcome, ${user.username}`,
        "token": token
      })
    }
  }
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    username: user.username,
    id: user.id
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET.JWT_SECRET, options)
}

module.exports = router;
