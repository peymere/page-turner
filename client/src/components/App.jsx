import { useState, useEffect } from 'react';
import '../stylesheets/App.css';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';


function App() {
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then((user) => setUser(user))
      } else {
        // handle what should happen if not logged in
        console.log('error')
      }
    })
  }, [])

  

  
  return (
    <div className="App">
      <header>
        <NavBar setUser={setUser} />
      </header>
      <Outlet context={setUser}/>
    </div>
  );

}

export default App;
