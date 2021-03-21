const mongoose = require('mongoose');

let con = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/sound', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("connected to the database");
    } catch(error) {
        console.log(error)
    }
}

con();



