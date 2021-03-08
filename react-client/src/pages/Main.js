import { useState, useEffect, useContext } from 'react'

import {UserContext} from "../contexts/UserContext";

import { useHistory } from 'react-router-dom'

import {EventContext} from "../contexts/EventContext";

import Header from '../components/Header'
import Event from "../components/Event";

import axios from "axios";
import "../styles/Main.css";

function Main() {
  const {user, setUser} = useContext(UserContext);
  const {events, setEvents} = useContext(EventContext);

  const [filterVal, setFilterVal] = useState('All Events');

  const history = useHistory();

  const refreshToken = async () => {
        try {
            const result = await axios.get('http://localhost/user/refresh',{headers:{"Authorization": `Bearer ${user.refresh}`}});
            return result.data.access_token;
        } catch (e) {
            return undefined;
        }
  }

  const fetchEvents = async () => {
      try {
          const result = await axios.get('http://localhost/event/host-list',{headers: {"Authorization": `Bearer ${user.access}`}});

          let eventsReturned = [];

          // If there are events:
          if (result.data.response === undefined){
              eventsReturned = [].concat(result.data.single, result.data.multi);
          }

          setEvents({eventsList:eventsReturned, activeEvent:undefined});

      } catch (e) {
          // Unauthorised due to expired token
          if (e.response.status === 401 && e.response.data.msg === "Token has expired") {
              const newToken = await refreshToken();
              if (newToken !== undefined){
                  let userObject = {...user, access: newToken};
                  setUser(userObject,() => {fetchEvents()});
              }
          }
      }
  }

  const createEvent = () => {history.push("/create")}

  useEffect(() => {
      // Don't let user's see this page if they're not logged in:
      if (user === undefined || user.login === false){
        history.push("/login");
        return;
      }

      const asyncFetchEvents = async () => {
          const status = await fetchEvents();
      }

      // Fetch events that the user owns:
      asyncFetchEvents();

      // setEvents({eventsList:[{"completed":false,"description":"new talk about something","endDate":"2021-03-07","endTime":"20:00:00","eventCode":25129026,"eventID":1,"eventName":"New Event","eventType":"talk","hostName":"New Host","live":true,"startDate":"2021-03-07","startTime":"8:07:00"},{"completed":false,"description":"new talk about something","endDate":"2021-03-07","endTime":"20:00:00","eventCode":25180283,"eventID":2,"eventName":"New Event","eventType":"talk","hostName":"New Host","live":true,"startDate":"2021-03-07","startTime":"8:07:00"},{"completed":true,"description":"new talk about something","endDate":"2020-03-07","endTime":"20:00:00","eventCode":49772515,"eventID":3,"eventName":"New Event","eventType":"talk","hostName":"New Host","live":false,"startDate":"2020-03-07","startTime":"8:07:00"},{"completed":false,"description":"new talk about something","endDate":["2021-03-15","2021-04-15","2021-05-15"],"endTime":["20:00:00","21:30:00","10:30:00"],"eventCode":78494270,"eventID":[4,5,6],"eventName":"New Event","eventType":"workshop","hostName":"New Host","live":false,"startDate":["2021-03-15","2021-04-15","2021-05-15"],"startTime":["18:00:00","19:00:00","10:00:00"]}]});
    }, []);
  
  return (
    <div className="Main">
      <Header className="header" title='Your Events' color='pink' text='Create Event' name={user.name} onClick={createEvent} />
      <div className="listTitlePadding">
          <div className="listTitle">
              <div className='box'>
                  <h4>Event Name</h4>
              </div>
              <div className='box'>
                  <h4>Event Type</h4>
              </div>
              <div className='box'>
                  <h4>Event Date & Time</h4>
              </div>
              <div className='buttonTitle'>
                  <select  className='selectFilter' name="filter" id="eventFilter" value={filterVal} onChange={e=> setFilterVal(e.target.value)}>
                      <option value="All Events">All Events</option>
                      <option value="Current Events">Current Events</option>
                      <option value="Completed Events">Completed Events</option>
                  </select>
              </div>
          </div>
      </div>

      <div className="mainBody">

          <div className="eventList">
              {events.eventsList !== undefined ?
                  events.eventsList.length>0 ?
                      <>
                          {events.eventsList.map((event, index) => (
                              filterVal === "All Events" ?
                              <Event key={index} id={event.id} event={event} /> :
                                  filterVal === "Completed Events" && event.completed === true ?
                                      <Event key={index} id={event.id} event={event} /> :
                                      filterVal == "Current Events" && event.completed === false ?
                                          <Event key={index} id={event.id} event={event} /> : <></>
                          ))}
                      </>
                      : <p>You haven't created any events yet, click 'Create Event' in the top left to get started.</p>
                  : <p>Events Loading</p>
              }
          </div>

      </div>
    </div>
  );
}

export default Main;
