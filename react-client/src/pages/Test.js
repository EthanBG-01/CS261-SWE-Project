import { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import {UserContext} from "../contexts/UserContext";
import {useHistory} from "react-router-dom";

import Header from '../components/Header'
import Button from '../components/Button'
import Question from '../components/Question'

const Test = () => {

    const {user, setUser} = useContext(UserContext);
    

    const history = useHistory();

    // This runs as soon as the page loads; if the user isn't logged in, it'll load the login screen.
    // Uses the context variables to determine if they're logged in.
    // var testdate = new Date()
    // const [startDate, setStartDate] = useState(moment(testdate).format());
    // const [startDate, setStartDate] = useState(null);
    // const [endDate, setEndDate] = useState();
    // const [startDate, setStartDate] = useState([]);
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

    // function addq() {

    // }

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

    //by default, send to backend
    // what if uncheck def, changed, check def
    // copy the state, edit on the seperate, if def return the ori def
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


    console.log(startDate)
    console.log(questions)
    

      return (

            <div className="Main">
                <Header title='Create Events' color='blue' text='Save Event' />
                <div className="mainBody">
                    <div className="detBox">
                        <h4>Details</h4>
                        <div className="detBody">
                            <div>
                                <h3>Event Name</h3>
                                <input value={ename} onChange={e=> setEName(e.target.value)} />
                            </div>
                            <div>
                                <h3>Host Name</h3>
                                <input value={hname} onChange={e=> setHName(e.target.value)} />
                            </div>
                            <div>
                                <h3>Event Type</h3>
                                {/* <input value={type} onChange={e=> setType(e.target.value)} /> */}
                                <select value={type} onChange={e=> setType(e.target.value)}>
                                    <option value="Talk">Talk</option>
                                    <option value="Project">Project</option>
                                    <option value="Workshop">Workshop</option>
                                </select>
                            </div>
                            <div>
                                <h3>Event Description</h3>
                                <input value={desc} onChange={e=> setDesc(e.target.value)} />
                            </div>
                            <div>
                                <h3>Use Default Question</h3>
                                <input type="checkbox" checked={defquestion} value={defquestion} onChange={e=> setDefQuestion(e.currentTarget.checked)} />
                            </div>
                            <div>
                                <h3>Event Start Date</h3>
                                {startDate.map((date,index) => (
                                    <div key={index}>
                                        <DatePicker
                                        selected={date.startdate}
                                        onChange={e => handleStartChange(index,e)}
                                        // onSelect={console.log(startDate)}
                                        // onChange={date => setStartDate(date)}
                                        // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                        showTimeSelect
                                        // dateFormat="MMMM d, yyyy h:mm aa" 
                                        dateFormat="yyyy/MM/dd h:mm" 
                                        // strictParsing
                                        />
                                        {type === "Workshop" ? (
                                            <Button color="red" text="Remove" onClick={()=> removeDate(index)}/> 
                                        ): (
                                            null        
                                        )}
                                    </div>
                                ))}

                                <h3>Event End Date</h3>
                                {endDate.map((date,index) => (
                                    <div key={index}>
                                        <DatePicker
                                        selected={date.enddate}
                                        onChange={e => handleEndChange(index,e)}
                                        // onSelect={console.log(startDate)}
                                        // onChange={date => setStartDate(date)}
                                        // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                        showTimeSelect
                                        // dateFormat="MMMM d, yyyy h:mm aa" 
                                        dateFormat="yyyy/MM/dd h:mm" 
                                        // strictParsing
                                        />
                                        {type === "Workshop" ? (
                                            <Button color="red" text="Remove" onClick={()=> removeDate(index)}/> 
                                        ): (
                                            null        
                                        )}
                                    </div>
                                ))}
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
                                {type === "Workshop" ? (
                                    <Button color="green" text="Add"  onClick={addDate}/>
                                ): (
                                    null        
                                )}
                                </>
                            </div>
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


export default Test