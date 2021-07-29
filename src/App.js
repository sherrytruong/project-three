import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';
import Instructions from './Instructions';
import Footer from './Footer';
import "./FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {

  const [ potluckList, setPotluckList ] = useState([]);
  const [ nameInput, setNameInput ] = useState("");
  const [ itemInput, setItemInput ] = useState("");
  const [ categorySelect, setCategorySelect ] = useState("placeholder");
  const [ categorySelectText, setCategorySelectText ] = useState("");

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
        newStateArray.unshift(Object);
      }

      // Set new potluck list to state
      setPotluckList(newStateArray);

    })

  }, []);

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

  // Object that contains key-value pairs; the KEY is the select element's option value, and the VALUE is the string with space and capitalization. This is for display purposes on the stickynote li
  const categorySelectDisplayText = {
    mainDish: "Main Dish",
    sideDish: "Side Dish",
    dessert: "Dessert",
    beverage: "Beverage",
    other: "Other"
  };

  // Function that handles changes in select element on form 
  const handleSelectChange = (e) => {
    setCategorySelect(e.target.value);
    setCategorySelectText(categorySelectDisplayText[e.target.value]);
  }

  // Function that listens to submit button and runs the following code
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput !== "" && itemInput !== "" && categorySelect !== "placeholder") {
      const dbRef = firebase.database().ref();
      dbRef.push([nameInput, itemInput, categorySelect, categorySelectText]);
      setNameInput("");
      setItemInput("");
      setCategorySelect("placeholder");
    } else if (nameInput !== "" || itemInput !== "" && nameInput == "" || itemInput == "") {
      alert("Enter a valid response");
    };
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

        <main>
          <Instructions />

          {/* ---- Form Section --- */}
          <form action="submit" onSubmit={handleSubmit}>
            <label htmlfor="userNameInput" className="sr-only">Name:</label>
            <input
              id="userNameInput"
              type="text"
              name="userNameInput"
              placeholder="Your Name"
              onChange={handleInputChange}
              value={nameInput}
            />
            <label htmlfor="userItemInput" className="sr-only">Item:</label>
            <input
              id="userItemInput"
              type="text"
              name="userItemInput"
              placeholder="Your Item"
              onChange={handleInputChange}
              value={itemInput}
            />
            <label htmlfor="userCategorySelect" className="sr-only">Category:</label>
            <select
              name="userCategorySelect"
              id="userCategorySelect"
              value={categorySelect}
              onChange={handleSelectChange}
            >
              <option value="placeholder" selected disabled>-- Select Category --</option>
              <option value="mainDish">Main Dish</option>
              <option value="sideDish">Side Dish</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
              <option value="other">Other</option>
            </select>
            <button type="submit">Add</button>
          </form>

          {/* ---- Display Results Section --- */}
          <ul>
            {potluckList.map((potluckLi) => {
              return (
                <li className={`stickyNoteLi `} key={potluckLi.key}>
                  <div className="pin">
                  </div>
                  <div className="stickyContainer">
                    <h2>Name:</h2>
                    <p>{potluckLi.value[0]}</p>
                    <h2>Bringing:</h2> 
                    <p>{potluckLi.value[1]}</p>
                    <p><span className={`${potluckLi.value[2]}`}>{potluckLi.value[3]}</span></p>
                  </div>
                  <button className="removeBtn" onClick={() => handleDelete(potluckLi.key)} aria-label="Remove list item"><FontAwesomeIcon icon="times" aria-hidden="true" /></button>
                </li>
              )
            })}
          </ul>
        </main>
      </div>
      <Footer />
    </div>

  );
}

export default App;
