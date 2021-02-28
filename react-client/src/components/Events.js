import Event from './Event'

const Events = ({ eventList }) => {

    // Careful with mapping; if its empty, or undefined it'll crash - so make sure to check this!

    return (
        <div>
            {eventList !== undefined ?
                eventList.length>0 ?
                    <>
                    {eventList.map((event, index) => (
                        <Event key={index} id={event.id} event={event} />
                    ))}

                </>
                : <></>
                :<></>
            }


        </div>
    )
}

export default Events
