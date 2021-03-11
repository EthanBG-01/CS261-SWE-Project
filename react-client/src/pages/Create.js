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
    const [type, setType] = useState('');
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
        setQuestions([...questions, { responsetype: 'average',
            default: 'No',
            question: '',
            questionData: [],
        }])
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
        values[index].questionData[test] = value;
        // console.log("test")
        // console.log(value)
        // console.log(index)
        // console.log(test)
        // console.log(values)
        setQuestions(values);
    }

    function handleDelete(index, test){
        const values = [...questions];
        values[index].questionData.splice(test,1);
        setQuestions(values);
    }

    function handleAdd(index){
        const values = [...questions];
        values[index].questionData = [...values[index].questionData, ""]
        setQuestions(values);
    }

    function handleSelect(value, index){
        const values = [...questions];
        values[index].responsetype = value;
        setQuestions(values);
    }

    function handleText(value, index){
        const values = [...questions];
        values[index].questionData = [value];
        setQuestions(values);
    }

    function handleQuestionDelete(index){
        const values = [...questions];
        values.splice(index,1);
        setQuestions(values);
    }

    function handleTypeChange(e){
        setType(e.target.value)
        if (e.target.value === "talk" || e.target.value === "project"){
            setStartDate([{ startdate: new Date()}])
            setEndDate([{ enddate: new Date()}])
        }
    }

    const [questions, setQuestions] = useState([
        {
            userID: 1,
            responsetype: 'average',
            default: 'Yes',
            question: 'How satisfied are you with the event?',
            questionData: [
                "Unsatisfied",
                "Satisfied"
            ],
        },
        {
            userID: 2,
            responsetype: 'discrete',
            default: 'Yes',
            question: 'Are the topics covered interesting?',
            questionData: [
                "Yes",
                "No",
            ]
        },
        {
            userID: 3,
            responsetype: 'average',
            default: 'Yes',
            question: 'Is the session delivered in an engaging way?',
            questionData: [
                "No",
                "Yes"
            ],
        },
        {
            userID: 4,
            responsetype: 'discrete',
            default: 'Yes',
            question: 'How do you find the pace of the session?',
            questionData: [
                "Too Slow",
                "Slow",
                "Ok",
                "Fast",
                "Too Fast"
            ],
        },
        {
            userID: 5,
            responsetype: 'text',
            default: 'Yes',
            question: 'What elements of the session did you like the most?',
            questionData: [],
        },
        {
            userID: 6,
            responsetype: 'text',
            default: 'Yes',
            question: 'What is your Professional Experience?',
            questionData: [],
        },
        {
            userID: 7,
            responsetype: 'text',
            default: 'Yes',
            question: 'If anything, what do you dislike about the session?',
            questionData: [],
        },
        {
            userID: 8,
            responsetype: 'discrete',
            default: 'Yes',
            question: 'How are you feeling right now?',
            questionData: [
                "Very Bad",
                "Bad",
                "Neutral",
                "Good",
                "Excellent"
            ],
        },
        {
            userID: 9,
            responsetype: 'text-sentiment',
            default: 'Yes',
            question: 'Can you provide a few reasons why?',
            questionData: [],
        },
    ]);

    useEffect(() => {
        // if (user.login === false){
        //     history.push("/login");
        // }

    }, []);

    // const fetchTemplate = async () => {
    //     console.log("yeet");
    //     const result = axios.get('http://localhost/feedback/get-template',{headers: {"eventType": `${type}`}});
    //     console.log(result);
    //     try {
    //         const result = await axios.get('http://localhost/feedback/get-template',{headers: {"eventType": `${type}`}});
  
    //         // let eventsReturned = [];
  
    //         // // If there are events:
    //         // if (result.data.response === undefined){
    //         //     eventsReturned = [].concat(result.data.single, result.data.multi);
    //         // }
  
    //         // setQuestions(result);
    //         console.log("yeet");
    //         console.log(result);
        
  
    //     } catch (e) {
    //         // Unauthorised due to expired token
    //         // if (e.response.status === 401 && e.response.data.msg === "Token has expired") {
    //         //     const newToken = await refreshToken();
    //         //     if (newToken !== undefined){
    //         //         let userObject = {...user, access: newToken};
    //         //         setUser(userObject,() => {fetchTemplate()});
    //             // }
            
    //     }
    // }

    // // const saveEvent = async () => {

    // //     // let date = moment(startDate[0].startdate).format('YYYY-MM-DD');
    // //     // let time = moment(startDate[0].startdate).format('H:mm:ss');
    // //     // console.log(date);
    // //     // console.log(time);

    // //     let returnFlag = false;
    // //     let startValues = [...startDate];
    // //     let endValues = [...endDate];
    // //     if (type === "workshop") {
    // //         let sdate = [];
    // //         let edate = [];
    // //         let stime = [];
    // //         let etime = [];
    // //         var i;
    // //         for (i = 0; i < startValues.length; i++) {
    // //             sdate = [...sdate, moment(startValues[i].startdate).format('YYYY-MM-DD')];
    // //             edate = [...edate, moment(endValues[i].enddate).format('YYYY-MM-DD')];
    // //             stime = [...stime, moment(startValues[i].startdate).format('H:mm:ss')];
    // //             etime = [...etime, moment(endValues[i].enddate).format('H:mm:ss')];
    // //         }
    // //     } else {
    // //         sdate = moment(startValues[0].startdate).format('YYYY-MM-DD');
    // //         edate = moment(endValues[0].enddate).format('YYYY-MM-DD');
    // //         stime = moment(startValues[0].startdate).format('H:mm:ss');
    // //         etime = moment(endValues[0].enddate).format('H:mm:ss');
    // //     }

    // //     if (ename.length === 0) {
    // //         setENameError("Event title cannot be left blank");
    // //         returnFlag = true;
    // //     } else {
    // //         setENameError("");
    // //     }

    // //     if (hname.length === 0) {
    // //         setHNameError("Host Name cannot be left blank.");
    // //         returnFlag = true;
    // //     } else {
    // //         setHNameError("");
    // //     }

    // //     if (returnFlag) return;

    // //     try {
    // //         const result = await axios.post('http://localhost/event/create-event', {
    // //             'eventName': ename,
    // //             'hostName': hname,
    // //             'eventType': type,
    // //             'startDate': sdate,
    // //             'endDate': edate,
    // //             'startTime': stime,
    // //             'endTime': etime,
    // //             'description': desc,
    // //         });

    // //         const userObject = {
    // //             access: result.data.access_token,
    // //             refresh: result.data.refresh_token,
    // //             login: true,
    // //             name: result.data.response,
    // //         };

    // //         console.log("Success");
    // //         setUser(userObject);

    // //         history.push("/");

    // //     } catch (e) {
    // //         console.log(e.response.data.response);
    // //         setSubmitError(e.response.data.response);
    // //     }
    // // };

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


    return (
        <div className="Main">
            <Header title='Create Events' color='blue' text='Save Event' name={user.name} />

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
                                    <select value={type} onChange={e=> handleTypeChange(e)}>
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
                                ): (
                                    null
                                )}
                            </>
                        </div>

                    <div>
                        <h3>Use Default Question</h3>
                        <input type="checkbox" checked={defquestion} value={defquestion} onChange={e=> setDefQuestion(e.currentTarget.checked)} />
                    </div>
                </div>
                <div className='questionBody'>
                    {questions.map((question,index) => (
                        <div key={index}>
                            {/* <Question ques={question} num={(index + 1).toString()} def={defquestion} /> */}
                            <Question ques={question} num={(index + 1).toString()} def={defquestion}
                                      updateGlobal={handleChangeFLabel} deleteRadio={handleDelete} addRadio={handleAdd}
                                      updateSelect={handleSelect} updateText={handleText} updateQuestion={handleQuesChange}
                                      deleteQuestion={handleQuestionDelete} />
                        </div>
                    ))}
                    {/* <Question /> */}
                    {defquestion ? (
                        null
                    ): (
                        <Button color="grey" text="Add Question"  onClick={addQuestion}/>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Create
