import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './style.css';

import { UserContext } from './contexts/UserContext'
import Nav from './components/Nav'
import Main from './pages/Main'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Create from './pages/Create'
import Register from './pages/Register';
import Test from './pages/Test'
import {EventContext} from "./contexts/EventContext";


function App() {
  const [user, setUser] = useState({
    access: undefined,
    refresh: undefined,
    login: false,
  });

  const [events, setEvents] = useState ({
    eventsList: [],
  })

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div id="App">
          <Nav />
          <EventContext.Provider value={{ events, setEvents }}>
            <Switch>
              {/* <Route path="/" exact
              render={(props) => (
                <Main  events={events}/>
                )}
              /> */}
              <Route path="/login" component={Login} />
              <Route path="/" exact component={Main} />
              <Route path="/register" component={Register} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/create" component={Create} />
              <Route path="/test" component={Test} />
            </Switch>
          </EventContext.Provider>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
