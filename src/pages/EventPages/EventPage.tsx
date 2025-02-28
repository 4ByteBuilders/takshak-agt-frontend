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
      image: ["/event1.jpeg"],
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Blurred Colorful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500 via-slate-900 to-slate-600 opacity-60 blur-3xl"></div>
      <div className="relative z-10">
        <EventsCard events={eventData} />
      </div>
    </div>
  )
}

export default EventPage;
