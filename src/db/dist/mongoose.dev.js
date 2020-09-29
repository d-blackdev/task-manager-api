"use strict";

var mongoose = require("mongoose");

var validator = require('validator'); // const Schema = mongoose.Schema()


mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
  useNewUrlParser: true,
  useCreateIndex: true
});
var User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    validate: function validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: function validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  }
});
var Task = mongoose.model("Task", {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
}); // const task = new Task({
//     description: 'Buy a car',
//     completed: true,
//     required: true
// });
// task.save().then(() => {
//     console.log(task)
// }).catch(err => {
//     console.log(err)
// })

var Kenny = new User({
  name: 'Bose',
  age: 29,
  email: 'bose@bose.com'
});
Kenny.save().then(function () {
  console.log("Success");
})["catch"](function (err) {
  console.log("Error" + err);
});