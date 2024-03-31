import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import Menus from '../menus';

const AppRouter = ({ isLoggedIn, userObj }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <BrowserRouter>
    <Menus isLoggedIn={isLoggedIn} userObj={userObj}/>
      {/* {isLoggedIn && <Navigation userObj={userObj} />} */}
      <Routes>
        {
          isLoggedIn ? (
            <Route>
              <Route exact path="/" Component={() => <Home userObj={userObj} />}/>
              <Route exact path="/profile" Component={() => <Profile userObj={userObj} />}/>
            </Route>
          ) : (
            <Route>
              <Route exact path="/" Component={Auth} />
            </Route>
          )
        }
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;