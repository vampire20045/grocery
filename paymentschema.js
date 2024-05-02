const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  firstName: {
    type: String,

  },
  lastName: {
    type: String,
 
  },
  address: {
    type: String,
    
  },
  country: {
    type: String,
  
  },
  city: {
    type: String,

  },
  state: {
    type: String,

  },
  zip: {
    type: String,
  
  }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
