import { useState, useEffect, createContext } from 'react';
import { Alert, Fade } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

// local imports
import '../stylesheets/App.css';

export const OutletContext = createContext();

function App() {
  const [user, setUser] = useState(null)
  const [showAlert, setShowAlert] = useState(false);
  

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

  useEffect(() => {
    if (showAlert) {
        const timerId = setTimeout(() => {
            setShowAlert(false);
        }, 2000);

        return () => clearTimeout(timerId);
    }
  }, [showAlert]);

  const context = {user, setUser, setShowAlert}

  
  return (
    <div className="App">
      <header>
        <NavBar user={user} setUser={setUser} />
      </header>
      <div className='landing_container'>
      {showAlert && (
        <Fade in={showAlert} className='pt-4' >
          <Alert key="info" variant="info">
              Your account has been successfully deleted.
          </Alert>
        </Fade>
      )}
      <OutletContext.Provider value={{user, setUser, setShowAlert}}>
      <Outlet context={context}/>
      </OutletContext.Provider>
      </div>
    </div>
  );

}

export default App;
