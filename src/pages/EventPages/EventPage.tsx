import EventsCard from '@/components/EventPageComponents/EventsCard'

const EventPage = () => {
    const eventData = [
        {
          name: "D.I In The House - Live In Concert",
          place: "O2 Arena, London",
          date: "2025-02-24",
          availability: {total: 500, available: 100},
          description: "Step into a Marathi world of hilarity and entertainment as we bring you an unforgettable solo performance by Pranit More! Get ready to laugh your heart out and experience comedy at its finest!",
          price: [
            { type: "General", price: 2000 },
            { type: "VIP", price: 5000 },
          ],
          image: "/public/event1.jpeg",
        },
        {
          name: "Event 2",
          place: "Place 2",
          date: "2025-03-10",
          availability: {total: 500, available: 100},
          description: "Description for Event 2",
          price: [
            { type: "General", price: 15 },
            { type: "VIP", price: 40 },
          ],
          image: "/public/event1.jpeg",
        },
        {
          name: "Event 2",
          place: "Place 2",
          date: "2025-03-10",
          availability: {total: 500, available: 100},
          description: "Description for Event 2",
          price: [
            { type: "General", price: 15 },
            { type: "VIP", price: 40 },
          ],
          image: "/public/event1.jpeg",
        },
        {
          name: "Event 2",
          place: "Place 2",
          date: "2025-03-10",
          availability: {total: 500, available: 100},
          description: "Description for Event 2",
          price: [
            { type: "General", price: 15 },
            { type: "VIP", price: 40 },
          ],
          image: "/public/event1.jpeg",
        },
      ];
  return (
    <div className='m-auto p-4'>
        <EventsCard events={eventData}/>    
    </div>
  )
}

export default EventPage