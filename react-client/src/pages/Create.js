import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Header from '../components/Header'

import "../styles/Create.css";

import {UserContext} from "../contexts/UserContext";

const Create = () => {
    // const onClick = () => {history.push("/create")}
    // return (
    //     <div>
    //         <h1>This is the create event page</h1>
    //     </div>
    // )


    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    // This runs as soon as the page loads; if the user isn't logged in, it'll load the login screen.
    // Uses the context variables to determine if they're logged in.
    useEffect(() => {
        if (user.login === false){
            history.push("/login");
        }
        // Use an API call to fetch all the hosts' events and update the event context.

    }, []);
    // ^ the [] determines when this function is run. When empty, it'll run whenever the component is loaded.

    return (
        <div className="Main">
            <Header title='Create Events' color='blue' text='Save Event' />
            <div className="mainBody">
                <div className="detBox">
                    <h4>Details</h4>
                    <div className="detBody">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create
