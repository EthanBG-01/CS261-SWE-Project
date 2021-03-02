import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Header from '../components/Header'
import Events from '../components/Events'
import {UserContext} from "../contexts/UserContext";
import {EventContext} from "../contexts/EventContext";
import Event from "../components/Event";


function Main() {
  // consider having completed as one of the state to show where to put what

  const {user, setUser} = useContext(UserContext);
  const {events, setEvents} = useContext(EventContext);

  const history = useHistory();

  const onClick = () => {history.push("/create")}

    // This runs as soon as the page loads; if the user isn't logged in, it'll load the login screen.
    // Uses the context variables to determine if they're logged in.
    useEffect(() => {

        if (user.user === undefined || user.user.login === false){
            history.push("/login");
            return;
        }

        // You'd make an API call to the events host list endpoint and update this state.
        // It's now a context variable, accessible in everything wrapped by the event context provider.
        // I've passed this to the events component to list the events, but technically that component could also just use the context now.
        let eventsList = [
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
        ]

        setEvents({eventsList:eventsList, activeEvent:undefined});
        console.log(events);


    }, []);
  
  return (
    <div className="Main">
      <Header title='Your Events' color='pink' text='Create Event' onClick={onClick} />
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
            <Events eventList={events.eventsList}/>
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
