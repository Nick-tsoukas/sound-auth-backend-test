require('dotenv').config()
require('./db/mongoose');
const express = require('express'),
      port    = 8000 || process.env.PORT,
      User    = require('./models/User'),
      cors    = require('cors'),
      app     = express();

// routes
const users = require('./routes/users');
const booking = require('./routes/booking');

const router = express.Router();

app.use(cors());
app.use(users);
app.use(booking);

app.get('/', (req, res) => {
    try {
        res.send('Welcome to the home page')
    } catch (error) {
        res.status(500).send("Sorry ... there was and error: " , error );
    }
});

app.post('/', (req, res) => {
    try {
        res.send({...req.body})
    } catch (error) {
        res.send("sorry")
    }
})
app.listen(8000, () => {
    console.log('now listening on port: ', port)
})