import { MapPin, Calendar, Armchair } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const EventCard = ({ name, place, date, availability, description, price, image }) => {
  return (
    <Card className="flex flex-col h-full rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-110">
      <img src={image} alt={name} className="w-full h-52 object-cover rounded-t-lg" />
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>  
        <div className="flex justify-between mt-2">
          <div>
            <div className="flex items-center mt-2">
              <MapPin strokeWidth={"1px"} size={"16px"} className="mr-2" />
              <CardDescription className="inline-block">{place}</CardDescription>
            </div>
            <div className="flex items-center mt-2">
              <Calendar strokeWidth={"1px"} size={"16px"} className="mr-2" />
              <CardDescription className="inline-block">{date}</CardDescription>
            </div>
            <div className="flex items-center mt-2">
              <Armchair strokeWidth={"1px"} size={"16px"} className="mr-2" />
              <CardDescription className="inline-block">{availability.available} / {availability.total} available</CardDescription>
            </div>
          </div>
          <ul className="mt-2 text-right">
            {price.map((priceDetail, idx) => (
              <li key={idx}>{priceDetail.type}: ₹ {priceDetail.price}</li>
            ))}
          </ul>
        </div>
      </CardHeader>
      <CardContent className='min-h-100'>
        <CardDescription>
          <p className="mt-2">{description}</p>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const EventsCard = ({ events }) => {
  return (
    <div className="mx-20 my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {events.map((event, index) => (
        <EventCard
          key={index}
          name={event.name}
          place={event.place}
          date={event.date}
          availability={event.availability}
          description={event.description}
          price={event.price}
          image={event.image}
        />
      ))}
    </div>
  );
};

export default EventsCard;