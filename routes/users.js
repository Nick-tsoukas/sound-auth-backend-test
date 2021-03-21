const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const router = express.Router();
require('../auth/auth');
const jwt = require('jsonwebtoken');



router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// login routes 
// now learn how to store the token

// New User Route
// passport.authenticate('signup', { session: false })
router.post('/signup',passport.authenticate('signup', { session: false }), async (req, res, next) => {
    try {
      console.log(req.user, 'there  should be something here');
      const body = { _id: req.user._id, email: req.user.email };
      const token = jwt.sign({ user: body }, process.env.SECRET_TOKEN);
      res.json({
        message: 'Signup successful',
        user: req.user,
        messageNick: 'all good',
        token: token
      });
    } catch (error) {
        console.log('there was an error in the sign up in the catch block')
        res.send(error)
    }
});


router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

router.post('/getOne',passport.authenticate('jwt', { session: false }), async (req,res) => {
  try {
    let user = await User.findOne({email: req.body.email});
    res.send(user)
  } catch (error) {
    res.send("Can't find the user")
  }
})

router.post(
    '/login',
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
  
              return next(error);
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.SECRET_TOKEN);
  
                return res.json({ token });
              }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
  );


module.exports = router;
