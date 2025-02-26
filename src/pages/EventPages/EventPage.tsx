import EventsCard from '@/components/EventPageComponents/EventsCard'

const EventPage = () => {
  const eventData = [
    {
      name: "D.I In The House - Live In Concert",
      place: "Swami Vivekananda Stadium, Agartala",
      date: "24th February 2025",
      availability: { total: 500, available: 100 },
      description: "Step into a Marathi world of hilarity and entertainment as we bring you an unforgettable solo performance by Pranit More! Get ready to laugh your heart out and experience comedy at its finest!",
      price: [
        { type: "Stag", price: 499 },
        { type: "Couple", price: 799 },
      ],
      image: ["/public/event1.jpeg"],
    },
    {
      name: "D.I In The House - Live In Concert",
      place: "Swami Vivekananda Stadium, Agartala",
      date: "24th February 2025",
      availability: { total: 500, available: 100 },
      description: "Step into a Marathi world of hilarity and entertainment as we bring you an unforgettable solo performance by Pranit More! Get ready to laugh your heart out and experience comedy at its finest!",
      price: [
        { type: "Stag", price: 499 },
        { type: "Couple", price: 799 },
      ],
      image: ["/public/event1.jpeg"],
    },
    {
      name: "D.I In The House - Live In Concert",
      place: "Swami Vivekananda Stadium, Agartala",
      date: "24th February 2025",
      availability: { total: 500, available: 100 },
      description: "Step into a Marathi world of hilarity and entertainment as we bring you an unforgettable solo performance by Pranit More! Get ready to laugh your heart out and experience comedy at its finest!",
      price: [
        { type: "Stag", price: 499 },
        { type: "Couple", price: 799 },
      ],
      image: ["/public/event1.jpeg"],
    },
    {
      name: "D.I In The House - Live In Concert",
      place: "Swami Vivekananda Stadium, Agartala",
      date: "24th February 2025",
      availability: { total: 500, available: 100 },
      description: "Step into a Marathi world of hilarity and entertainment as we bring you an unforgettable solo performance by Pranit More! Get ready to laugh your heart out and experience comedy at its finest!",
      price: [
        { type: "Stag", price: 499 },
        { type: "Couple", price: 799 },
      ],
      image: ["/public/event1.jpeg"],
    },
  ];
  return (
    <div className='m-auto p-4'>
      <EventsCard events={eventData} />
    </div>
  )
}

export default EventPage