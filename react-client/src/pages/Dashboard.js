import React, { useState, useEffect, useContext, PureComponent } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {UserContext} from "../contexts/UserContext";
import {EventContext} from "../contexts/EventContext";
import {useHistory} from "react-router-dom";
import { BarChart, Bar, LabelList, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label} from 'recharts';


export function BarChartContainer({title, dataPairs, type}) {
  const arr = [];
  for (const o in dataPairs) {
    arr.push({Categories: o, Totals: dataPairs[o]});
  }

  return (  
    <div
      style={{
        backgroundColor:"#ffffff",
        border:"solid grey 3px",
        borderRadius:"5px",
        width: 500,
        height: 450       
      }}>
      <h1>{title}</h1>

      <BarChart
        width={500}
        height={400}  
        data={arr}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        >
        <XAxis dataKey="Categories">
          <Label value={"Categories"} offset={-10} position="insideBottom" />
        </XAxis>  
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis allowDecimals={false} label={{ value: "Totals", angle: -90, position: 'insideLeft'}}/>
        <Bar dataKey="Totals" fill="#8884d8"/>
      </BarChart>
    </div>

  );
 
}

export function AvgChartContainer({title, dataPairs}) {
  //{'Average': 3.0, 'Responses': 1}
  const arr = [{name: "Average", average: dataPairs.Average}];
  return (  
    <div
      style={{
        backgroundColor:"#ffffff",
        border:"solid grey 3px",
        borderRadius:"5px",
        width: 500,
        height: 450       
      }}>
      <h1>{title}</h1>

      <BarChart
        width={500}
        height={400}  
        data={arr}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        >
        <XAxis dataKey="name">
          <Label offset={-10} position="insideBottom" />
        </XAxis>  
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis allowDecimals={false}  domain={[-5, 5]}/>
        <Bar dataKey="average" fill="#8884d8" label={{ position: 'top' }}/>
      </BarChart>
    </div>

  );
 
}

export function SentimentChartContainer({title, dataPairs}) {
  const arr = [];
  for (const o in dataPairs) {
    arr.push({Emotions: o, Totals: dataPairs[o]});
  }

  return (  
    <div
      style={{
        backgroundColor:"#ffffff",
        border:"solid grey 3px",
        borderRadius:"5px",
        width: 500,
        height: 450       
      }}>
      <h1>{title}</h1>

      <BarChart
        width={500}
        height={400}  
        data={arr}
        margin={{ top: 20, right: 30, left: 20, bottom: 50}}
        >
        <XAxis dataKey="Emotions">
          <Label value={"Emotions"} offset={-10} position="insideBottom" />
        </XAxis>  
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis allowDecimals={false} label={{ value: "Totals", angle: -90, position: 'insideLeft'}}/>
        <Bar dataKey="Totals" fill="#8884d8"/>
      </BarChart>
    </div>

  );
 
}

export function TextChartContainer({title, responses}) {
  const nameArray = [];
  const responseArray = [];
  for (let i = 0; i < responses.length; i++) {
    nameArray.push(<p>{responses[i][0]}</p>);
    responseArray.push(<p>{responses[i][1]}</p>);
  }

  return ( 
    <div
      style={{
        backgroundColor:"#ffffff",
        border:"solid grey 3px",
        borderRadius:"5px",
        width: 500,
        height: 450       
      }}>
      <h1>{title}</h1>

      <div style={{width: "20%", float:"left"}}>
        {nameArray}
      </div>

      <div style={{width: "80%", float:"right"}}>
        {responseArray}
      </div>
    </div>
  );
 
}



const Dashboard = () => {
    const finalHtml = []

    const {user, setUser} = useContext(UserContext);
    const {events, setEvents} = useContext(EventContext);

    // return (
    //     <div>
    //         <h1>This is the Dashboard page</h1>
            
    //     </div>
    // )

    const history = useHistory();

    // This runs as soon as the page loads; if the user isn't logged in, it'll load the login screen.
    // Uses the context variables to determine if they're logged in.
    /*useEffect(() => {
        // will have to get json data here
        if (user.user.login === false){
            console.log("Not logged in.");
            history.push("/login");
        }
    }, []); */


    const results = [{'questionID': 5, 'questionTitle': 'blah blah?', 'questionType': 'average', 'data': {'Average': 3.0, 'Responses': 1}},
    {'questionID': 18, 'questionTitle': 'blah?', 'questionType': 'discrete', 'data': {'categories': {'yes': 1, 'no': 1, 'maybe': 0}}},
    {'questionID': 9, 'questionTitle': 'blah blah blah?', 'questionType': 'discrete', 'data': {'categories': {'not motivated': 0, 'slightly motivated': 1, 'highly motivated': 0}}},
    {'questionID': 17, 'questionTitle': 'What is your role in the project?', 'questionType': 'text-no-sentiment', 'data': {'Responses': [['Bob', 'I am watching, dude'], ['Bob', 'I am watching, dude']]}},
    {'questionID': 7, 'questionTitle': 'Can you please provide a few reasons why?', 'questionType': 'text-sentiment', 'data': {"emotions" : {"sadness" : 0, "tired": 1, "angry" : 2}}}]

    const [startDate, setStartDate] = useState(null);

      return (
        <div>
            {results.map((item, i) => {
              return (
                item.questionType == "discrete" ?
                  <><BarChartContainer title = {item.questionTitle} dataPairs = {item.data.categories} />
                  <br></br></> :
                  item.questionType == "average" ?
                    <><AvgChartContainer title = {item.questionTitle} dataPairs = {item.data} />
                    <br></br></> :
                    item.questionType == "text-sentiment" ?
                    <><SentimentChartContainer title = {item.questionTitle} dataPairs = {item.data.emotions} />
                    <br></br></> :
                      <><TextChartContainer title = {item.questionTitle} responses = {item.data.Responses} />
                      <br></br></>
              )
            })}
        </div>
      );
}

export default Dashboard
