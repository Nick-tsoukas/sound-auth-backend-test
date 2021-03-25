const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique : true,
        dropDups: true,
        required: true,
    },
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
    },
    phonenumber: {
      type: Number,
      trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isAdmin : {
      type: Boolean,
      default: false
    },
    bookingRequests : {
      type: Array,
      default: []
    }
});

UserSchema.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
    }
  );
  
  UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }


const User = mongoose.model('User', UserSchema);

module.exports = User;