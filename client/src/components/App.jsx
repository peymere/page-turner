import { useState, useEffect, createContext } from 'react';
import '../stylesheets/App.css';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export const OutletContext = createContext();

function App() {
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then((user) => setUser(user))
        console.log(user)
      } else {
        // handle what should happen if not logged in
        console.log('error')
      }
    })
  }, [])

  const context = {user, setUser}

  
  return (
    <div className="App">
      <header>
        <NavBar user={user} setUser={setUser} />
      </header>
      <OutletContext.Provider value={{user, setUser}}>
      <Outlet context={context}/>
      </OutletContext.Provider>
    </div>
  );

}

export default App;
