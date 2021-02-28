import { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {UserContext} from "../contexts/UserContext";
import {useHistory} from "react-router-dom";

const Dashboard = () => {

    const {user, setUser} = useContext(UserContext);

    // return (
    //     <div>
    //         <h1>This is the Dashboard page</h1>
            
    //     </div>
    // )

    const history = useHistory();

    // This runs as soon as the page loads; if the user isn't logged in, it'll load the login screen.
    // Uses the context variables to determine if they're logged in.
    useEffect(() => {

        if (user.user.login === false){
            console.log("Not logged in.");
            history.push("/login");
        }
    }, []);

        const [startDate, setStartDate] = useState(null);

      return (
        <div>  
            <DatePicker
            selected={startDate}
            // onSelect={console.log(startDate)}
            onChange={date => setStartDate(date)}
            showTimeSelect
            // dateFormat="MMMM d, yyyy h:mm aa" 
            dateFormat="yyyy/MM/dd h:mm" 
            // strictParsing
            />
        </div>
      );
}

export default Dashboard
