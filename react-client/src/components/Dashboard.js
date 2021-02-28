import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Dashboard = () => {
    // return (
    //     <div>
    //         <h1>This is the Dashboard page</h1>
            
    //     </div>
    // )


    const [startDate, setStartDate] = useState(null)
    console.log(startDate)

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
