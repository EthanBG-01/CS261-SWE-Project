import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './style.css';

import Nav from './components/Nav'
import Main from './components/Main'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Create from './components/Create'


function App() {
  // consider having completed as one of the state to show where to put what
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Example Event Name',
      type: 'Session',
      day: '04/03/2021 15:00',
    },
    {
      id: 2,
      name: 'Example Coding Project Name',
      type: 'Coding Project',
      day: '12/03/2021 13:00',
    },
    {
      id: 1,
      name: 'Example Coding Project Name',
      type: 'Coding Project',
      day: '12/12/2020 11:00',
    },
  ])

  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact 
          render={(props) => (
            <Main  events={events}/>
            )}
          />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/create" component={Create} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
