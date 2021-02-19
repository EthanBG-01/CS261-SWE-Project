import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from './Header'
import Events from './Events'


function Main({ events }) {
  // consider having completed as one of the state to show where to put what

  //implement use effect which calls api

  
  return (
    <div className="Main">
      <Header title='Your Events' />
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
