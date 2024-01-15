const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give pw as args");
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log("too long :\(");
  process.exit(1);
}

const password = process.argv[2];
const url =
  `mongodb+srv://uyennhiquang3407:${password}@cluster0.xeu5irx.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((note) => console.log(note));
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const theName = process.argv[process.argv.length - 2];
  const theNumber = process.argv[process.argv.length - 1];

  const person = new Person({
    name: theName,
    number: theNumber,
  });

  person.save().then((result) => {
    console.log(`added ${theName} number ${theNumber} to phonebook`);
    mongoose.connection.close();
  });
}
