import React, { useState, useEffect, useContext } from 'react'
import {UserContext} from "../contexts/UserContext";
import {EventContext} from "../contexts/EventContext";
import {useHistory} from "react-router-dom";

import "../styles/Dashboard.css";
import Header from "../components/Header";
import axios from "axios";

import moodImage from '../assets/bad.png';

import {BarChartWidget} from "../components/Widgets/BarChartWidget";
import {AverageWidget} from "../components/Widgets/AverageWidget";
import {TextWidget} from "../components/Widgets/TextWidget";
import {SentimentWidget} from "../components/Widgets/SentimentWidget";

const Dashboard = () => {

    const {user, setUser} = useContext(UserContext);
    const {events, setEvents} = useContext(EventContext);
    const [results, setResults] = useState({"analysis":[{"data":{"Average":0,"Responses":0},"questionID":1,"questionTitle":"How satisfied are you with the session so far?","questionType":"average"},{"data":{"categories":{"interesting":0,"not interesting":0,"somewhat interesting":0}},"questionID":2,"questionTitle":"Are the topics covered interesting?","questionType":"discrete"},{"data":{"Average":0,"Responses":0},"questionID":3,"questionTitle":"Is the session delivered in an engaging way?","questionType":"average"},{"data":{"Average":0,"Responses":0},"questionID":4,"questionTitle":"The length/pace of the session is: ","questionType":"average"},{"data":{"categories":{"bad":0,"excellent":0,"good":0,"neutral":0,"very bad":0}},"questionID":5,"questionTitle":"How are you feeling right now?","questionType":"discrete"},{"data":{"categories":{"accomplished":0,"angry":0,"bored":0,"confused":0,"excited":0,"grateful":0,"joy":0,"motivated":0,"optimism":0,"sadness":0,"stressed":0,"tired":0,"worried":0}},"questionID":6,"questionTitle":"Select an emotion that best reflects your current situation : ","questionType":"discrete"},{"data":{"emotions":{"accomplished":0,"angry":0,"bored":0,"confused":0,"excited":0,"grateful":0,"joy":0,"motivated":0,"optimism":0,"sadness":0,"stressed":0,"tired":0,"worried":0}},"questionID":7,"questionTitle":"Can you please provide a few reasons why? ","questionType":"text-sentiment"},{"data":{},"questionID":8,"questionTitle":"What elements of the session did you like the most? ","questionType":"text-no-sentiment"},{"data":{},"questionID":9,"questionTitle":"If anything, what did you dislike about the session?","questionType":"text-no-sentiment"},{"data":{},"questionID":10,"questionTitle":"What is your job / professional experience?","questionType":"text-no-sentiment"}],"feedback":[{"questionID":7,"questionText":[]},{"questionID":8,"questionText":[]},{"questionID":9,"questionText":[]},{"questionID":10,"questionText":[["Ethan", "Test"], ["Faris", "Test"]]}],"generalMood":"very bad"});

    // TODO - fakeData -> events.details.eventName
    const [fakeData, setFakeData] = useState({"completed":false,"description":"Test Descriptions","endDate":"2021-03-15","endTime":"3:00:00","eventCode":39991645,"eventID":2,"eventName":"Elections","eventType":"talk","hostName":"WIS","live":true,"startDate":"2021-03-15","startTime":"0:00:00"});
    const history = useHistory();

    // TODO - LIVE: Fetch at regular intervals.

    const fetchResults = async () => {
        try {
            console.log("Fetching Results");
            const result = await axios.post('http://localhost/feedback/view-feedback', {eventID:events.activeEvent});
            setResults(result.data);

            if (events.eventsList[0].live === true) {
                this.timeoutHandle = setTimeout(()=>{
                    fetchResults();
                }, 5000);
            }

        } catch (e) {
            console.log(e.response);
        }
    }

    useEffect(() => {
        // if (user.login === false){
        //     console.log("Not logged in.");
        //     history.push("/login");
        // }

        const asyncFetchResults = async () => {
            const status = await fetchResults();
        }

        asyncFetchResults();
    }, []);

    const findText = (questionID) => {
        for (let i=0; i<results.feedback.length; i++){
            if (results.feedback[i].questionID === questionID) {
                return results.feedback[i];
            }
        }
    }

    const [startDate, setStartDate] = useState(null);

    return (
        <div className="Main">
            <header className='header'>
                <div className='headerItems'>
                    <div className="eventDetailsHeader">
                        <h2>{fakeData.eventName}</h2>
                        <h3>Host Name: {fakeData.hostName}</h3>
                        {
                            fakeData.live ?
                                <p>Event is Live.</p>:<p>Event not Live.</p>
                        }
                    </div>

                    <div>
                        <h1>Join Code: {fakeData.eventCode}</h1>
                    </div>


                </div>
            </header>
            <div className="mainBody">
                <div className="moodContainer veryBad">
                    <h2>General Mood: {results !== undefined ? results.generalMood : "N/A"}</h2>
                    <img src={moodImage} />
                </div>
                <div className="widgetContainer">
                    {results === undefined ? <></> : results.analysis.map((item, i) => {
                        return (
                            item.questionType === "discrete" ?
                                <BarChartWidget className="widgetBox" key={i} title = {item.questionTitle} dataPairs = {item.data.categories} />:
                                item.questionType === "average" ?
                                    <AverageWidget className="widgetBox" key={i}  title = {item.questionTitle} average={item.data}/> :
                                    item.questionType === "text-no-sentiment"?
                                        <TextWidget className="widgetBox" title = {item.questionTitle} responses = {findText(item.questionID)}/>
                                        :<SentimentWidget className="widgetBox" title = {item.questionTitle} emotions = {item.data.emotions} responses={findText(item.questionID)}/>
                        )
                    })}
                </div>
            </div>
        </div>

    );
}

export default Dashboard
