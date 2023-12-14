import { useState, useEffect, createContext } from 'react';
import { Alert, Fade } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

// local imports
import '../stylesheets/App.css';

export const OutletContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)
  console.log(loggedInUser)
  const [showAlert, setShowAlert] = useState(false);
  const [bookClubs, setBookClubs] = useState(null)
  
  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then((user) => setLoggedInUser(user))
        console.log(loggedInUser)
      } else {
        // handle what should happen if not logged in
        console.log('error')
      }
    })
  }, [])

  useEffect(() => {
    fetch('/bookclubs')
    .then((resp) => {
      if (resp.ok) {
        return resp.json()
      } else {
        console.log('error')
      }
      })
    .then((bookClubsData) => setBookClubs(bookClubsData))
    .catch((err) => {
      console.log("Error getting bookclubs:", err);
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

  const context = {loggedInUser, setLoggedInUser, setShowAlert, bookClubs}

  return (
    <div className="App">
      <header>
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      </header>
      <div className='landing_container'>
      {showAlert && (
        <Fade in={showAlert} className='pt-4' >
          <Alert key="info" variant="info">
              Your account has been successfully deleted.
          </Alert>
        </Fade>
      )}
      <OutletContext.Provider value={{loggedInUser, setLoggedInUser, setShowAlert, bookClubs}}>
        <Outlet context={context}/>
      </OutletContext.Provider>
      </div>
    </div>
  );

}

export default App;
