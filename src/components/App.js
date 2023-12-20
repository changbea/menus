import { useState, useEffect } from 'react';
import Router from 'components/Router';
import auth from 'serverbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true)
    })
    // auth.onAuthStateChanged((user) => console.log(user));
  }, [])
  // console.log(isLoggedIn)
  
  return (
    <div className="App">
      {init ? <Router isLoggedIn={isLoggedIn} userObj={userObj} /> : 'Initializing'}
      <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </div>
  );
}

export default App;
