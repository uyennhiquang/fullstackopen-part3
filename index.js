const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan("tiny"));

app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p>\n<p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const requestedPerson = persons.find((person) => person.id === id);

  if (requestedPerson) {
    response.json(requestedPerson);
  } else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number)
    response.status(400).json({
      error: "incomplete fields",
    });
  else if (persons.find((person) => person.name === body.name) !== undefined) {
    response.status(400).json({
      error: "name already in the system",
    });
  }

  const newPerson = {
    id: persons.length + 1,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  console.log(persons);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
