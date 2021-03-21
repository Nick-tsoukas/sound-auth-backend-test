const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Booking = require('../models/Booking');
const router = express.Router();
require('../auth/auth');
const jwt = require('jsonwebtoken');

// there needs to be a book button. On click it will check if you are logged in


router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// This route needs to secure. User need to be looged in to make booking request
router.get('/booking', async (req, res) => {
    try {
      let books =   await Booking.find();
      res.send(books)
    } catch (error) {
        res.send(error)
    }
})

router.post('/booking',passport.authenticate('jwt', { session: false }), async (req,res) => {
    console.log('this is the booking route')
    try {
        const bookRequest = Booking.create({date: req.body.date, time: req.body.time, userId: req.body.userId});
        bookRequest.then((data) => {
            res.send(data)
        })
    } catch (error) {
        res.send(error)
    }
});

router.post('/booktest', (req, res) => {
    res.send(req.headers)
})

module.exports = router;
