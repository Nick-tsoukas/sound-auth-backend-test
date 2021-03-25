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

// This where the user is found and then send down to the next function in the route
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // looks for user, by email and the saves to variable
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        // Passport method is valid password is called with the password sent from the post request of any front end
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }
        else { 
          // This is where the user is finally returned with a message send
          return done(null, user, { message: 'Logged in Successfully' });
        }
       
      } catch (error) {
        return done(error);
      }
    }
  )
);



// passport.use(
//   'login',
//   new localStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password'
//     },
//     async (email, password, done) => {
//       console.log('does this ever run');
//       try {
//         const user = await User.findOne({ email });

//         if (!user) {
//           console.log('there is a problem on the authfile jus 39')
//           return done(null, false, { message: 'User not found' });
//         }

//         const validate = await user.isValidPassword(password);

//         if (!validate) {
//           return done(null, false, { message: 'Wrong Password' });
//         }

//         return done(null, user, { message: 'Logged in Successfully' });
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );


// usernaeField sets the property name for auth creds. This function will also create the user talking to mongodb 
passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback:true
      },
      async (req,email, password, done) => { 
        console.log(req.body.firstname,)
        try {
          const user = await User.create({ email, password, firstname: req.body.firstName, lastname: req.body.lastName, phonenumber: req.body.phoneNumber });
  
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

