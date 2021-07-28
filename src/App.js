import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';

function App() {

  const [ potluckList , setPotluckList ] = useState([]);
  const [ nameInput, setNameInput] = useState("");
  const [ itemInput, setItemInput] = useState("");
  const [ categorySelect, setCategorySelect] = useState("");
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
    if (name === "userNameInput") {
      setNameInput(value);
    } 
    else {
      setItemInput(value);
    } 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput !== "" && itemInput !== "") {
      const dbRef = firebase.database().ref();
      dbRef.push([nameInput, itemInput]);
      setNameInput("");
      setItemInput("");
      setCategorySelect(""); // how to make this clear out?
    } else if (nameInput !== "" || itemInput !== "" && nameInput == "" || itemInput == "") {
      alert("Enter a valid response");
  }
}

  // const handleUserCategorySelect = (e) => {
  //   setCategorySelect(e.target.value)
  // }

  const handleDelete = (keyToDelete) => {
    console.log(keyToDelete);
    const dbRef = firebase.database().ref();
    dbRef.child(keyToDelete).remove();
  }

  return (
    <div className="App">
      <div className="container wrapper">
        <h1>Potluck Board</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam quis et tenetur dolor, nostrum pariatur ut corrupti magni. Facilis architecto tempore aut neque qui omnis est doloribus saepe! </p>
        <form action="submit" onSubmit={handleSubmit}>
          <label htmlfor="userNameInput" class="sr-only">Name:</label>
          <input 
            id="userNameInput"
            type="text" 
            name="userNameInput"
            placeholder="Your Name" 
            onChange={handleChange} 
            value={nameInput} 
          />
          <label htmlfor="userItemInput" class="sr-only">Item:</label>
          <input 
            id="userItemInput"
            type="text" 
            name="userItemInput"
            placeholder="Your Item" 
            onChange={handleChange} 
            value={itemInput} 
          />
          <label htmlfor="userCategorySelect" class="sr-only">Category:</label>
          <select 
            name="userCategorySelect"
            id="userCategorySelect" 
            // value={categorySelect} 
            // onChange={handleUserCategorySelect}
          >
            <option value="placeholder" selected disabled>-- Select Category --</option>
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
              <li className="stickyNoteLi" key={potluckLi.key}>
                <div className="pin">
                </div>
                <ul className="stickyContainer">
                  <li><p><span>Name:</span> {potluckLi.value[0]}</p></li>
                  <li><p><span>Item:</span> {potluckLi.value[1]}</p></li>
                  <li><p><span>Category:</span> {potluckLi.value[2]}</p></li>
                </ul>
                  <p><button onClick={handleClick}>♥</button> {countValue} likes</p>
                  <button class="removeBtn" onClick={() => handleDelete(potluckLi.key)}> x </button>
                {/* </div> */}
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
