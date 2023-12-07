import { useState, useEffect } from 'react';
import '../stylesheets/App.css';



import Signup from './Signup';

function App() {
  const [user, setUser] = useState(null)

  return <Signup setUser={setUser} />

}

export default App;
