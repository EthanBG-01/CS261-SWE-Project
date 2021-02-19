import Button from './Button'

const Event = ({ event }) => {
    return (
        <div className='event'>
            <div className='box'>
                <h5 float='left'>{event.name}</h5>
            </div>
            <div className='box'>
                <h5 float='left'>{event.type}</h5>
            </div>
            <div className='box'>
                <h5 float='left'>{event.day}</h5>
            </div>
            <div className='btnbox'>
                <Button color='grey' text='Edit' />     
                <Button color='grey' text='Show Feedback' />
            </div>
        </div>
    )
}

export default Event
