import { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import {UserContext} from "../contexts/UserContext";
import {useHistory} from "react-router-dom";

import Header from '../components/Header'
import Button from '../components/Button'

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
    const [endDate, setEndDate] = useState(null);
    const [ename, setEName] = useState('');
    const [hname, setHName] = useState('');
    const [type, setType] = useState('');
    const [desc, setDesc] = useState('');
    const [defquestion, setDefQuestion] = useState(true);

    // function addq() {

    // }

    function addsd(){
        setStartDate([...startDate, { startdate:new Date() }])
    }

    const handleChange = (index, e) => {
        const values = [...startDate];
        values[index].startdate = e;
        setStartDate(values);
    }

    console.log(startDate)
    

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
                                        onChange={e => handleChange(index,e)}
                                        // onSelect={console.log(startDate)}
                                        // onChange={date => setStartDate(date)}
                                        // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                        showTimeSelect
                                        // dateFormat="MMMM d, yyyy h:mm aa" 
                                        dateFormat="yyyy/MM/dd h:mm" 
                                        // strictParsing
                                        />
                                    </div>
                                ))}

                                <h3>Event End Date</h3>
                                <DatePicker
                                selected={endDate}
                                // onSelect={console.log(startDate)}
                                onChange={date => setEndDate(date)}
                                // onChange={date => setStartDate(moment(date).format("MMMM Do YYYY, h:mm:ss a"))}
                                showTimeSelect
                                // dateFormat="MMMM d, yyyy h:mm aa" 
                                dateFormat="yyyy/MM/dd h:mm" 
                                // strictParsing
                                />
                                <Button color="green" text="Add"  onClick={addsd}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      );
}

export default Test