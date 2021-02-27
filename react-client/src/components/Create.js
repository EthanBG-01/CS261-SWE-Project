import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Header from './Header'
import Events from './Events'

const Create = () => {
    const history = useHistory()
    // const onClick = () => {history.push("/create")}
    // return (
    //     <div>
    //         <h1>This is the create event page</h1>
    //     </div>
    // )

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
