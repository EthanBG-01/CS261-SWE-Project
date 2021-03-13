import React, { useState, useEffect, useContext } from 'react'
import {UserContext} from "../contexts/UserContext";
import {EventContext} from "../contexts/EventContext";
import {useHistory} from "react-router-dom";

import "../styles/Dashboard.css";
import Header from "../components/Header";
import axios from "axios";


import {BarChartWidget} from "../components/Widgets/BarChartWidget";
import {AverageWidget} from "../components/Widgets/AverageWidget";
import {TextWidget} from "../components/Widgets/TextWidget";
import {SentimentWidget} from "../components/Widgets/SentimentWidget";

const Dashboard = () => {

    const {user, setUser} = useContext(UserContext);
    const {events, setEvents} = useContext(EventContext);
    const [results, setResults] = useState(undefined);

    const history = useHistory();

    // TODO - LIVE: Fetch at regular intervals.

    const fetchResults = async () => {
        try {
            const result = await axios.post('http://localhost/feedback/view-feedback', {eventID:[events.activeEvent]});
            setResults(result.data);
        } catch (e) {
            console.log(e.response);
        }
    }

    useEffect(() => {

        if (user.login === false){
            console.log("Not logged in.");
            history.push("/login");
        }

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
            <Header className="header" title='Events Analysis'  text='Create Event' name={user.name} button={false}/>
            <div className="listTitlePadding">
                <div className="listTitle">
                    <div className='box'>
                        <h4>Event Name</h4>
                    </div>
                </div>
            </div>
            <div className="mainBody">
                <div>
                    <h1>General Mood: {results.generalMood}</h1>
                </div>
                <div className="widgetContainer">
                    {results.analysis.map((item, i) => {
                        return (
                            item.questionType === "discrete" ?
                                <BarChartWidget key={i} title = {item.questionTitle} dataPairs = {item.data.categories} />:
                                item.questionType === "average" ?
                                    <AverageWidget key={i}  title = {item.questionTitle} average={item.data}/> :
                                    item.questionType === "text-no-sentiment"?
                                        <TextWidget title = {item.questionTitle} responses = {findText(item.questionID)}/>
                                        :<SentimentWidget title = {item.questionTitle} emotions = {item.data.emotions} responses={findText(item.questionID)}/>
                        )
                    })}
                </div>
            </div>
        </div>

    );
}

export default Dashboard
