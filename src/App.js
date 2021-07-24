import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';

function App() {

  const [ potlucklist , setPotluckList ] = useState([]);
  const [ userInput, setUserInput] = useState("");

  useEffect( () => {
    // Variable that holds reference to database
    const dbRef = firebase.database().ref();

    // Add event listener to variable dbRef, will fire each time there is a change in value in database. Function takes a callback function which will get data (response) from the database
    dbRef.on('value', (response) => {
      // Store response from query to firebase inside responseData variable
      const responseData = response.val();
      console.log(responseData);

      // Variable that stores the new state
      const newStateArray = [];

      for (let propertyName in responseData) {
        console.log(propertyName);
        console.log(responseData[propertyName])

        const Object = {
          key: propertyName,
          value: responseData[propertyName]
        }

        newStateArray.push(Object);

      }

      setPotluckList(newStateArray);





    })
  }, []);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const dbRef = firebase.database().ref();
    dbRef.push(userInput);
    setUserInput("");
  }

  return (
    <div className="App wrapper">
      <h1>Potluck Tracker!</h1>
      <form action="submit" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" onChange={handleChange} value={userInput}/>
        {/* <select name="type" id="type" placeholder="Select Item Type">
          <option value="appetizer">Appetizer</option>
          <option value="main">Main</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
          <option value="other">Other</option>
        </select> */}
        {/* <input type="text" name="item" placeholder="Your Item" onChange={handleChange} value={userItem} /> */}
        <button type="submit">Add</button>
      </form>
      <ul>
        {/* {potluckList.map( (potluckLi) => {
          return (
            <li>
              <p>{potluckLi}</p>
            </li>
          )
        })} */}
      </ul>
      <p>Created at Juno College by Sherry Truong</p>
    </div>

  );
}

export default App;
