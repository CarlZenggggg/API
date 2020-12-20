const mongoose = require('mongoose');


const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return this.emailConfirmation === v
      },
      message: props => `${props.value} doesn't match the email confirmation`
    }
  }
});



UserSchema.virtual('emailConfirmation')
.get(function () {
  return this._emailConfirmation;
})
.set(function (value) {
  this._emailConfirmation = value;
});

UserSchema.virtual('password')
.get(function () {
  return this._password;
})
.set(function (value) {
  this._password = value;
});

UserSchema.virtual('passwordConfirmation')
.get(function () {
  return this._passwordConfirmation;
})
.set(function (value) {
  if (this.password !== value) this.invalidate('password', 'Password and password confirmation must match');
  this._passwordConfirmation = value;
});


UserSchema.virtual('fullname')
.get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  passwordField:'password',
});

module.exports = mongoose.model('User', UserSchema);