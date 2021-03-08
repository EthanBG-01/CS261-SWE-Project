import React, { useState, useContext } from 'react';
import Button from './Button'
import {EventContext} from "../contexts/EventContext";

import {useHistory} from "react-router-dom";

import "../styles/eventContainer.css";

const Event = ({ event }) => {
    const [eventID] = useState(event.eventID)
    const {events, setEvents} = useContext(EventContext);

    const history = useHistory();

    const eventStyling = event.completed === true ? 'completedEvent' : event.live === true ? 'liveEvent' : 'upcommingEvent';


    const handle = () =>{
        console.log("handling click", eventID);
        setEvents({...events, activeEvent: eventID});
        history.push("/dashboard");
    }

    return (
        <div className={eventStyling + ' event'}>
            <div className='box'>
                <h5 float='left'>{event.eventName}</h5>
            </div>
            <div className='box'>
                <h5 float='left'>{event.eventType}</h5>
            </div>
            <div className='box'>
                <h5 float='left'>{event.startDate}, {event.startTime}</h5>
            </div>
            <div className='btnbox'>
                <Button styleClass={"editButton"} text='Edit' />
                <Button styleClass={"feedbackButton"} text={event.live === true ? "Live Feedback" : "View Feedback"} onClick={handle} />
            </div>
        </div>
    )
}

export default Event
