import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './style.css';

import { UserContext } from './contexts/UserContext'
import Nav from './components/Nav'
import Main from './components/Main'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Create from './components/Create'
import Register from './components/Register';


function App() {
  const [user, setUser] = useState({
    access: undefined,
    refresh: undefined,
  });

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="App">
          <Nav />
          <Switch>
            {/* <Route path="/" exact 
            render={(props) => (
              <Main  events={events}/>
              )}
            /> */}
            <Route path="/" exact component={Main} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/create" component={Create} />
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
