// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  publisher: {
    type: String,
    required: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);