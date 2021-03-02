import React, { useState, useContext } from 'react';
import Button from './Button'
import {EventContext} from "../contexts/EventContext";

import {useHistory} from "react-router-dom";

const Event = ({ event }) => {
    const [eventID] = useState(event.id)
    const {events, setEvents} = useContext(EventContext);

    const history = useHistory();

    const handle = () =>{
        console.log("handling click", eventID);
        setEvents({...events, activeEvent: eventID});
        history.push("/dashboard");
    }

    return (
        <div className='event'>
            <div className='box'>
                <h5 float='left'>{event.name}</h5>
            </div>
            <div className='box'>
                <h5 float='left'>{event.type}</h5>
            </div>
            <div className='box'>
                <h5 float='left'>{event.day}</h5>
            </div>
            <div className='btnbox'>
                <Button color='grey' text='Edit' />     
                <Button color='grey' text='Show Feedback' onClick={handle} />
            </div>
        </div>
    )
}

export default Event
