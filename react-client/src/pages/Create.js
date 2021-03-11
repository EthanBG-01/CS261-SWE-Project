import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from "axios";
import moment from 'moment'

import "../styles/Create.css";
import 'react-datepicker/dist/react-datepicker.css'

import {UserContext} from "../contexts/UserContext";

import DatePicker from 'react-datepicker'
import Header from '../components/Header'
import Button from '../components/Button'
import Question from '../components/Question'

const Create = () => {
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    const [startDate, setStartDate] = useState([
        { startdate: new Date() },
    ]);
    const [endDate, setEndDate] = useState([
        { enddate: new Date() },
    ]);
    const [ename, setEName] = useState('');
    const [hname, setHName] = useState('');
    const [eNameError, setENameError] = useState('');
    const [hNameError, setHNameError] = useState('');
    const [type, setType] = useState("talk");
    const [desc, setDesc] = useState('');
    const [defquestion, setDefQuestion] = useState(true);



    function addDate(){
        setStartDate([...startDate, { startdate:new Date() }])
        setEndDate([...endDate, { enddate:new Date() }])
    }

    function removeDate(index){
        const startvalues = [...startDate];
        const endvalues = [...endDate];
        startvalues.splice(index, 1);
        endvalues.splice(index,1)
        setStartDate(startvalues);
        setEndDate(endvalues);
    }

    function addQuestion(){
        setQuestions([...questions,
            { outputType: 'average',
            question: '',
            responseType: ['Label', 'Label']}])
    }

    const handleStartChange = (index, e) => {
        const values = [...startDate];
        values[index].startdate = e;
        setStartDate(values);
    }

    const handleEndChange = (index, e) => {
        const values = [...endDate];
        values[index].enddate = e;
        setEndDate(values);
    }

    function handleQuesChange(value, index){
        const values = [...questions];
        values[index].question = value;
        setQuestions(values);
    }

    function handleChangeFLabel(value, index, test){
        const values = [...questions];
        values[index].responseType[test] = value;
        // console.log("test")
        // console.log(value)
        // console.log(index)
        // console.log(test)
        // console.log(values)
        setQuestions(values);
    }

    function handleDelete(index, test){
        const values = [...questions];
        values[index].responseType.splice(test,1);
        setQuestions(values);
    }

    function handleAdd(index){
        const values = [...questions];
        values[index].responseType = [...values[index].responseType, ""]
        setQuestions(values);
    }

    function handleSelect(value, index){
        const values = [...questions];
        values[index].outputType = value;
        setQuestions(values);
    }

    function handleText(value, index){
        const values = [...questions];
        values[index].responseType = [value];
        setQuestions(values);
    }

    function handleQuestionDelete(index){
        const values = [...questions];
        values.splice(index,1);
        setQuestions(values);
    }

    function handleTypeChange(e){
        let value = e.target.value;
        setType(value, () => {
            if (value === "talk" || value === "project"){
                setStartDate([{ startdate: new Date()}])
                setEndDate([{ enddate: new Date()}])
            }
        });

    }


    //userID
    //responseType
    //default
    //question
    //questionData


    //outputType -> average, discrete, text-sentiment, text-no-sentiment
    //responseType -> Array of data
    //questionID -> Number
    //question -> Text
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const getQuestions = async () => {
            await fetchTemplate();
        }

        // login check:
        // if (user.login === false){
        //      history.push("/login");
        // }

        // Fetch the default template questinos:
        getQuestions();


    }, []);

    const fetchTemplate = async () => {
        try {
            const result = await axios.post('http://localhost/feedback/get-template',{"eventType": `${type}`});
            setQuestions(result.data.response);
        } catch (e) {
            // Unauthorised due to expired token
            // if (e.response.status === 401 && e.response.data.msg === "Token has expired") {
            //     const newToken = await refreshToken();
            //     if (newToken !== undefined){
            //         let userObject = {...user, access: newToken};
            //         setUser(userObject,() => {fetchTemplate()});
                // }
            console.log(e.response);
        }
    }

    // useEffect(() => {
    //     console.log("yeet")
    //     // if (user.login === false){
    //     //     history.push("/login");
    //     // }

    //     // if (user === undefined || user.login === false){
    //     //     history.push("/login");
    //     //     return;
    //     //   }
    
    //     //   const asyncFetchTemplate = async () => {
    //     //       const status = await fetchTemplate();
    //     //   }
    
    //       // Fetch events that the user owns:
    //     fetchTemplate();

    // }, []);

    const createEvent = async () => {
        let errorFlag = false;

        // Collect event time/date details:
        let startValues = [...startDate];
        let endValues = [...endDate];

        let sdate, edate, stime, etime;

        if (type === "workshop") {
            sdate = [];
            edate = [];
            stime = [];
            etime = [];
            for (var i = 0; i < startValues.length; i++) {
                sdate = [...sdate, moment(startValues[i].startdate).format('YYYY-MM-DD')];
                edate = [...edate, moment(endValues[i].enddate).format('YYYY-MM-DD')];
                stime = [...stime, moment(startValues[i].startdate).format('H:mm:ss')];
                etime = [...etime, moment(endValues[i].enddate).format('H:mm:ss')];
            }
        } else {
            sdate = moment(startValues[0].startdate).format('YYYY-MM-DD');
            edate = moment(endValues[0].enddate).format('YYYY-MM-DD');
            stime = moment(startValues[0].startdate).format('H:mm:ss');
            etime = moment(endValues[0].enddate).format('H:mm:ss');
        }

        if (ename.length === 0) {
            setENameError("Event title cannot be left blank");
            errorFlag = true;
        } else {
            setENameError("");
        }

        if (hname.length === 0) {
            setHNameError("Host Name cannot be left blank.");
            errorFlag = true;
        } else {
            setHNameError("");
        }

        // TODO: Description Error Flag

        if (errorFlag) {
            console.log("empty");
            return;
        }

        let eventDetails =
            {
            'eventName': ename,
            'hostName': hname,
            'eventType': type,
            'startDate': sdate,
            'endDate': edate,
            'startTime': stime,
            'endTime': etime,
            'description': desc,
        };

        // TODO: event type not saving.
        console.log(eventDetails);

        try {
            const result = await axios.post('http://localhost/event/create-event', eventDetails, {headers:{"Authorization" : `Bearer ${user.access}`}});
            console.log(result);

            let eventID = result.data.eventID;
            if (!Array.isArray(eventID)){
                eventID = [result.data.eventID];
            }

            try {
                let questionDetails = {
                    'eventID':eventID,
                    'data':questions
                }
                const result2 = await axios.post('http://localhost/feedback/post-create-event', questionDetails);
                console.log(result2);
            } catch (e){
                console.log(e.response);
            }
        } catch (e) {
            console.log(e.response);
        }

        // TODO: Disable the save event button? Somehow show that the save was successful.
        // TODO: Sorting?

        //{
        //   "eventCode": 34106108,
        //   "eventID": 3,
        //   "response": "event created"
        // }



    }


    return (
        <div className="Main">

            <Header title='Create Events' color='blue' text='Save Event' name={user.name} onClick={createEvent}/>

            <div className="listTitlePadding">
                <div className="listTitle">
                    <h4>Event Details</h4>
                </div>
            </div>

            <div className="mainBody">


                <div className="detBox">
                    <h4>Details</h4>
                    <div className="detBody">

                        <div className="titleDetails">
                            <div className="titlesFlex">
                                <div className="textInp">
                                    <h3 className="formTitles">Title *</h3>
                                    <input className="input" value={ename} onChange={e=> setEName(e.target.value)} />
                                </div>

                                <div className="textInp">
                                    <h3 className="formTitles">Host Name * </h3>
                                    <input  className="input" value={hname} onChange={e=> setHName(e.target.value)} />
                                </div>

                                <div className="eventTypeDetails">
                                    <h3 className="formTitles">Event Type</h3>

                                    <select onChange={e=> handleTypeChange(e)}>
                                        <option value="talk">Talk</option>
                                        <option value="project">Project</option>
                                        <option value="workshop">Workshop</option>
                                    </select>

                                </div>
                            </div>

                            <div>
                                <h3 className="formTitles">Event Description</h3>
                                <textarea  className="inputDesc"  value={desc} onChange={e=> setDesc(e.target.value)} />
                            </div>
                        </div>






                            <div className="dateDetails">
                                <h3 className="formTitles">Event Start Date</h3>
                                {startDate.map((date,index) => (
                                    <div key={index}>
                                        <DatePicker
                                            selected={date.startdate}
                                            onChange={e => handleStartChange(index,e)}
                                            minDate={new Date()}
                                            // onSelect={console.log(startDate)}
                                            // onChange={date => setStartDate(date)}
                                            // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                            showTimeSelect
                                            // dateFormat="MMMM d, yyyy h:mm aa"
                                            dateFormat="yyyy/MM/dd h:mm"
                                            // strictParsing
                                        />
                                        {type === "workshop" ? (
                                            <Button color="red" text="Remove" onClick={()=> removeDate(index)}/>
                                        ): (
                                            null
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="dateDatails">
                                <h3 className="formTitles">Event End Date</h3>
                                {endDate.map((date,index) => (
                                    <div key={index}>
                                        <DatePicker
                                            selected={date.enddate}
                                            onChange={e => handleEndChange(index,e)}
                                            minDate={startDate[index].startdate}
                                            // onSelect={console.log(startDate)}
                                            // onChange={date => setStartDate(date)}
                                            // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                            showTimeSelect
                                            // dateFormat="MMMM d, yyyy h:mm aa"
                                            dateFormat="yyyy/MM/dd h:mm"
                                            // strictParsing
                                        />
                                        {type === "workshop" ? (
                                            <Button color="red" text="Remove" onClick={()=> removeDate(index)}/>
                                        ): (
                                            null
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* <DatePicker
                                selected={endDate}
                                // onSelect={console.log(startDate)}
                                onChange={date => setEndDate(date)}
                                // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                showTimeSelect
                                // dateFormat="MMMM d, yyyy h:mm aa"
                                dateFormat="yyyy/MM/dd h:mm"
                                // strictParsing
                                /> */}
                            <>
                                {type === "workshop" ? (
                                    <Button color="green" text="Add"  onClick={addDate}/>
                                ): null}
                            </>
                        </div>

                    <div>
                        <h3>Use Default Question</h3>
                        <input type="checkbox" checked={defquestion} value={defquestion} onChange={e=> setDefQuestion(e.currentTarget.checked)} />
                    </div>
                </div>
                <div className='questionBody'>
                    {questions.map((question,index) => (
                        <div key={index+"Q"}>
                            {/* <Question ques={question} num={(index + 1).toString()} def={defquestion} /> */}
                            <Question ques={question} num={(index + 1).toString()} def={defquestion}
                                      updateGlobal={handleChangeFLabel} deleteRadio={handleDelete} addRadio={handleAdd}
                                      updateSelect={handleSelect} updateText={handleText} updateQuestion={handleQuesChange}
                                      deleteQuestion={handleQuestionDelete} />
                        </div>
                    ))}
                    {/* <Question /> */}
                    {defquestion ? null: (
                        <Button color="grey" text="Add Question"  onClick={addQuestion}/>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Create
