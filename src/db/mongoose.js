const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
}, err => {
    if (err) {
      console.log(err)
    }
    console.log('Successfully connected to mogondb')
});




// const Kenny = new User({
//   name: "Bayo",
//   age: 29,
//   email: "bayo@bayo.com",
//   password: "hola",
// });
// Kenny.save()
//   .then(() => {
//     console.log("Success");
//   })
//   .catch((err) => {
//     console.log("Error" + err);
//   });
