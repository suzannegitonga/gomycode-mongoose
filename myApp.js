require('dotenv').config();
const mongoose = require('mongoose');

// Connect to the database using the required syntax
mongoose.connect(process.env.MONGO_URI);

// --- 1. Create a Person Prototype ---
const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String] // Array of strings
});

const Person = mongoose.model('Person', personSchema);

// --- 2. Create and Save a Record ---
const createAndSavePerson = function(done) {
  // Create a document instance
  const person = new Person({
    name: 'John Doe',
    age: 30,
    favoriteFoods: ['pizza', 'salad']
  });

  // Save the instance to the database
  person.save(function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

// --- 3. Create Many Records with model.create() ---
const createManyPeople = function(arrayOfPeople, done) {
  // Create multiple instances using the provided array
  Person.create(arrayOfPeople, function(err, people) {
    if (err) return done(err);
    done(null, people);
  });
};

// --- 4. Use model.find() ---
const findPeopleByName = function(personName, done) {
  // Find all people matching the given name
  Person.find({ name: personName }, function(err, people) {
    if (err) return done(err);
    done(null, people);
  });
};

// --- 5. Use model.findOne() ---
const findFood = function(food, done) {
  // Find one person who has the specified food in their favorites
  Person.findOne({ favoriteFoods: food }, function(err, person) {
    if (err) return done(err);
    done(null, person);
  });
};

// --- 6. Use model.findById() ---
const findPersonById = function(personId, done) {
  // Find a person by their unique _id
  Person.findById(personId, function(err, person) {
    if (err) return done(err);
    done(null, person);
  });
};

// --- 7. Classic Updates (Find, Edit, Save) ---
const findEditThenSave = function(personId, done) {
  // Find the person by _id
  Person.findById(personId, function(err, person) {
    if (err) return done(err);
    
    // Add "hamburger" to their favoriteFoods array
    person.favoriteFoods.push('hamburger');
    
    // Save the updated document inside the find callback
    person.save(function(err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

// --- 8. New Updates using model.findOneAndUpdate() ---
const findAndUpdate = function(personName, done) {
  // Find by name, set age to 20, and return the updated document
  Person.findOneAndUpdate(
    { name: personName }, 
    { age: 20 }, 
    { new: true }, // Ensures the updated document is returned
    function(err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

// --- 9. Delete One Document using model.findByIdAndRemove ---
const removeById = function(personId, done) {
  // Delete the person matching the _id
  Person.findByIdAndRemove(personId, function(err, removedPerson) {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

// --- 10. Delete Many Documents with model.remove() ---
const removeManyPeople = function(done) {
  // Remove all people named "Mary"
  Person.remove({ name: 'Mary' }, function(err, result) {
    if (err) return done(err);
    // Pass the JSON outcome object to the callback
    done(null, result);
  });
};

// --- 11. Chain Search Query Helpers ---
const queryChain = function(done) {
  // Find people who like burritos, sort by name, limit to 2, hide age
  Person.find({ favoriteFoods: 'burrito' })
    .sort('name')
    .limit(2)
    .select('-age') // The minus sign hides the field
    .exec(function(err, data) {
      if (err) return done(err);
      done(null, data);
    });
};

// Export functions for testing
module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};
