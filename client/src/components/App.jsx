import { useState, useEffect } from 'react';
import '../stylesheets/App.css';
import { Outlet } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null)

  
  return (
    <div className="App">
      <Outlet context={setUser}/>
    </div>
  );

}

export default App;
