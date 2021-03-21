const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_TOKEN,
      // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token') || 'token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        console.log('there is an error from the jwt')
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);


// usernaeField sets the property name for auth creds. This function will also create the user talking to mongodb 
passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.create({ email, password });
  
          return done(null, user);
        } catch (error) {
          console.log("there is an error in the catch block of the passport auth.js file line 19 sign up ")
          done(error);
        }
      }
    )
  );

