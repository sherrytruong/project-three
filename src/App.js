import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';

function App() {

  const [ potluckList , setPotluckList ] = useState([]);
  const [ nameInput, setNameInput] = useState("");
  const [ itemInput, setItemInput] = useState("");
  const [ categorySelect, setCategorySelect] = useState("Select");
  const [ countValue, setCountValue] = useState(0);

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

  const handleClick = () => {
    setCountValue(countValue + 1);
  }

  const handleChange = (e) => {
    // setNameInput(e.target.value);
    const { name, value } = e.target;
    if(name === "name") {
      setNameInput(value)
    } else {
      setItemInput(value);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput !== "" && itemInput !== "") {
      const dbRef = firebase.database().ref();
      dbRef.push(nameInput);
      setNameInput("");
      setItemInput("");
      setCategorySelect("Select");
    } else if (nameInput !== "" || itemInput !== "") {
      alert("Enter a valid response");
  }
}

  const handleDelete = (keyToDelete) => {
    console.log(keyToDelete);
    const dbRef = firebase.database().ref();
    dbRef.child(keyToDelete).remove();
  }

  return (
    <div className="App">
      <div className="container wrapper">
        <h1>Potluck Pinboard</h1>
        <p>Avoid bringing the same items and </p>
        <form action="submit" onSubmit={handleSubmit}>
          <label htmlfor="Name">Name:</label>
          <input 
            id="userNameInput"
            type="text" 
            name="name" 
            placeholder="Your Name" 
            onChange={handleChange} 
            value={nameInput} 
          />
          <label htmlfor="Item">Item:</label>
          <input 
            id="userItemInput"
            type="text" 
            name="item" 
            placeholder="Your Item" 
            onChange={handleChange} 
            value={itemInput} 
          />
          <label htmlfor="Category">Category:</label>
          <select 
            name="type" 
            id="userCategorySelect" 
            value={categorySelect} 
          >
            <option value disabled selected>-- Select Category --</option>
            <option value="appetizer">Appetizer/Sides</option>
            <option value="main">Main Dish</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
            <option value="other">Other</option>
          </select>
          <button type="submit">Add</button>
        </form>
        <ul>
          {potluckList.map( (potluckLi) => {
            return (
              <li key={potluckLi.key}>
                <p><span>Name:</span> {potluckLi.value}</p>
                <p><span>Item:</span> </p>
                <p><span>Category:</span> </p>
                <p><button onClick={handleClick}>♥</button> {countValue} likes</p>
                <button class="removeBtn" onClick={() => handleDelete(potluckLi.key)}> x </button>
              </li>
            )
          })}
        </ul>
      </div>
      <footer>
        <p>Created at <a href="http://junocollege.com" target="_blank">Juno College</a> by Sherry Truong</p>
      </footer>
    </div>


  );
}

export default App;
