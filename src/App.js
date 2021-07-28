import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faTimes);

function App() {

  const [ potluckList , setPotluckList ] = useState([]);
  const [ nameInput, setNameInput] = useState("");
  const [ itemInput, setItemInput] = useState("");
  const [ categorySelect, setCategorySelect] = useState("placeholder");
  const [ countValue, setCountValue] = useState(0);

  useEffect( () => {

    // Variable that holds reference to database
    const dbRef = firebase.database().ref();
    // Event listener to variable dbRef; fires each time there is a change in value in database. Takes a callback function which will get data (response) from the database
    dbRef.on('value', (response) => {
      // Store response from query to firebase inside responseData variable
      const responseData = response.val();

      // Variable that stores the new state
      const newStateArray = [];

      // Local variable propertyName represents each of the properties or keys in responseData object
      for (let propertyName in responseData) {
        // New object is declared and is pushed into newStateArray
        const Object = {
          key: propertyName,
          value: responseData[propertyName]
        }
        newStateArray.push(Object);
      }

      // Set new potluck list to state
      setPotluckList(newStateArray);

    })

  }, []);

  // Function that handles clicks on counter
  const handleClick = () => {
    setCountValue(countValue + 1);
  }

  // Function that handles changes in select element on form 
  const handleSelectChange = (e) => {
    setCategorySelect(e.target.value);
  }

  // Function that handles changes in input elements on form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userNameInput") {
      setNameInput(value);
    } 
    else {
      setItemInput(value);
    } 
  }

  // Function that listens to submit button and runs the following code
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput !== "" && itemInput !== "" && categorySelect !== "placeholder") {
      const dbRef = firebase.database().ref();
      dbRef.push([nameInput, itemInput, categorySelect]);
      setNameInput("");
      setItemInput("");
      setCategorySelect("placeholder");
    } else if (nameInput !== "" || itemInput !== "" && nameInput == "" || itemInput == "") {
      alert("Enter a valid response");
  }
}

  // Function that deletes the li element upon user click
  const handleDelete = (keyToDelete) => {
    const dbRef = firebase.database().ref();
    dbRef.child(keyToDelete).remove();
  }

  return (
    <div className="App">
      <div className="container wrapper">
        <header>
          <h1>Potluck Board</h1>
        </header>
        <section className="instructions">
          <p>Hosting a potluck party, or attending as a guest? Potluck Board has you covered on tracking all the contributions! Complete the fields below to make note of what you are bringing to your event. Check what other guests are contributing to the potluck, and avoid doubling up on the same items.</p>
        </section>

        {/* ---- Form Section --- */}
        <form action="submit" onSubmit={handleSubmit}>
          <label htmlfor="userNameInput" class="sr-only">Name:</label>
          <input 
            id="userNameInput"
            type="text" 
            name="userNameInput"
            placeholder="Your Name" 
            onChange={handleInputChange} 
            value={nameInput} 
          />
          <label htmlfor="userItemInput" class="sr-only">Item:</label>
          <input 
            id="userItemInput"
            type="text" 
            name="userItemInput"
            placeholder="Your Item" 
            onChange={handleInputChange} 
            value={itemInput} 
          />
          <label htmlfor="userCategorySelect" class="sr-only">Category:</label>
          <select 
            name="userCategorySelect"
            id="userCategorySelect" 
            value={categorySelect} 
            onChange={handleSelectChange}
          >
            <option value="placeholder" selected disabled>-- Select Category --</option>
            <option value="Main Dish">Main Dish</option>
            <option value="Side Dish">Side Dish</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Add</button>
        </form>

        {/* ---- Display Results Section --- */}
        <ul>
          {potluckList.map( (potluckLi) => {
            return (
              <li className="stickyNoteLi" key={potluckLi.key}>
                <div className="pin">
                </div>
                <ul className="stickyContainer">
                  <li><p><span className="name">Name:</span> {potluckLi.value[0]}</p></li>
                  <li><p><span className="item">Bringing:</span> {potluckLi.value[1]}</p></li>
                  <li><p><span className="category">Category:</span> {potluckLi.value[2]}</p></li>
                </ul>
                  <p><button onClick={handleClick}>♥</button> {countValue}</p>
                <button className="removeBtn" onClick={() => handleDelete(potluckLi.key)}> x </button>
                <FontAwesomeIcon icon={["fa", "Times"]} />
              </li>
            )
          })}
        </ul>
      </div>

      {/* ---- Footer --- */}
      <footer>
        <p>Created at <a href="http://junocollege.com" target="_blank">Juno College</a> by Sherry Truong</p>
      </footer>
    </div>


  );
}

export default App;
