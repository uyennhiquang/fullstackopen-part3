// import axios from "axios";
import personServices from "./services/persons";
import { useState, useEffect } from "react";

const StatusMessage = ({ value }) => {
  const message = value ? `Added ${value}` : "";

  const s = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={s}>{message}</div>;
};

const Filter = (props) => (
  <>
    <p>filter shown with</p>
    <input value={props.filterValue} onChange={props.onChangeFilter} />
  </>
);

const PersonForm = (props) => (
  <>
    <form>
      <h2>add a new</h2>
      <div>
        name: <input value={props.nameValue} onChange={props.onChangeName} />
      </div>
      <div>
        number:{" "}
        <input value={props.numberValue} onChange={props.onChangeNumber} />
      </div>
      <div>
        <button onClick={props.submitOnClick} type="submit">
          add
        </button>
      </div>
    </form>
  </>
);

const Person = ({ person, deletePerson }) => (
  <li>
    {person.name} {person.number}
    <button onClick={deletePerson}>delete</button>
  </li>
);

const Persons = ({ persons, deletePerson }) => (
  <section>
    <h2>Numbers</h2>
    <ul>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          deletePerson={() => deletePerson(person.id)}
        />
      ))}
    </ul>
  </section>
);

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    personServices.retrieve().then((persons) => setPersons(persons));
  }, []);

  if (!persons) {
    return null
  }

  const isIn = (person, persons) => {
    for (let i = 0; i < persons.length; i++) {
      if (person.name === persons[i].name) return persons[i].id;
    }
    return -1;
  };

  const handleNewName = (e) => setNewName(e.target.value);
  const handleNewNumber = (e) => setNewNumber(e.target.value);
  const handlePersonFilter = (e) => setPersonFilter(e.target.value);

  const addEntry = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const isPersonIn = isIn(personObject, persons);
    if (isPersonIn === -1) {
      personServices
        .create(personObject)
        .then((thePerson) => setPersons(persons.concat(thePerson)));
      setStatusMessage(personObject.name);
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      if (
        window.confirm(
          `${newName} is in the phonebook. Do you wish to change his/her phone number?`
        )
      ) {
        personServices
          .update(isPersonIn, personObject)
          .then((theUpdatedPerson) =>
            setPersons(
              persons.map((p) => (p.id === isPersonIn ? theUpdatedPerson : p))
            )
          );
      }
    }
    setNewName("");
    setNewNumber("");
  };

  const personsToDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(personFilter.toLowerCase())
  );

  const deletePersonOfId = (id) => {
    if (window.confirm(`Delete ${persons[id - 1].name}?`)) {
      setPersons(persons.filter((p) => p.id !== id));
      personServices.deleteEntry(id);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <StatusMessage value={statusMessage} />
      <Filter filterValue={personFilter} onChangeFilter={handlePersonFilter} />
      <PersonForm
        nameValue={newName}
        onChangeName={handleNewName}
        numberValue={newNumber}
        onChangeNumber={handleNewNumber}
        submitOnClick={addEntry}
      />
      <Persons persons={personsToDisplay} deletePerson={deletePersonOfId} />
    </div>
  );
};

export default App;
