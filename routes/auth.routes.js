const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User.model')

const checkForAuth = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}

/* Create New User */
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    res.send({ message: "Username and password can't be empty" })
    return
  } else if (password.length < 6) {
    res.send({ message: 'The password must be at least 6 digits long' })
    return
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.send({ message: 'This user already exists' })
        return
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10)
        User.create({ username, password: hashedPassword }).then((result) => {
          res.send({ message: 'User created', result })
        })
      }
    })
    .catch((err) => {
      res.send({ message: err })
    })
})

/* LOG IN */
router.post('/login', checkForAuth, (req, res) => {
  passport.authenticate('local', (err, user, failureDetails) => {
    if (err) {
      console.log(err)
      res.send({ message: 'Something went bad with Passport Authentication' })
      return
    }

    if (!user) {
      res.send({ message: 'This user does not exist', failureDetails })
      return
    }

    res.cookie('sameSite', 'none', {
      sameSite: true,
      secure: true,
    })

    req.login(user, (err) => {
      if (err) {
        res.send({ message: 'Something went bad with req.login', err })
      } else {
        User.findById(user._id)
          .populate('pokedex')
          .then((result) => {
            res.send({ message: 'Log in succesful', result })
          })
          .catch(() => {
            res.send({ message: 'Error finding the user' })
          })
      }
    })
  })(req, res)
})

router.get('/loggedin', (req, res, next) => {
  if (req.user) {
    User.findById(req.user._id)
      .populate('pokedex')
      .then((result) => {
        res.send({ message: 'Log in verified', result })
      })
      .catch(() => {
        res.send({ message: 'Error verifing the user' })
      })
  } else {
    res.send(req.user)
  }
})

module.exports = router
