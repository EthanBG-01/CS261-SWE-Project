import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'

import Header from './Header'
import Events from './Events'


function Main() {
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

  const history = useHistory()
  const onClick = () => {history.push("/create")}
  // const clickFunc = {() => {history.push("/create")}}

  //implement use effect which calls api

  
  return (
    <div className="Main">
      <Header title='Your Events' color='pink' text='Create Event' onClick={onClick} />
      {/* <Header title='Your Events' /> */}
      <div className="mainBody">
        <div className="eventList">
            <div className="listTitle">
              <div className='box'>
                  <h4>NAME</h4>
              </div>
              <div className='box'>
                  <h4>TYPE</h4>
              </div>
              <div className='box'>
                  <h4>DATE/TIME</h4>
              </div>
            </div>
            <Events events={events} />
        </div>
        <div className="eventList">
          <h4>Completed Events</h4>
          <div className="listTitle">
              <div className='box'>
                  <h4>Name</h4>
              </div>
              <div className='box'>
                  <h4>Type</h4>
              </div>
              <div className='box'>
                  <h4>Date/Time</h4>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
