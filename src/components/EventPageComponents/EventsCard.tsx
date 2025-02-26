import { MapPin, Calendar, Armchair } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Event {
  name: string;
  place: string;
  date: string;
  availability: {
    available: number;
    total: number;
  };
  description: string;
  price: {
    type: string;
    price: number;
  }[];
  image: string[];
}

const EventCard = ({ name, place, date, availability, description, price, image }: Event) => {
  return (
    <Card className="flex flex-col h-full rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-110">
      <div className="flex justify-center">
        <img src={image[0]} alt={name} className="rounded-t-lg w-full h-40 object-cover" />
      </div>
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
            <ul className="flex flex-wrap w-full items-center justify-center gap-4 mt-4">
              {price.map((priceDetail, idx) => (
                <li
                  key={idx}
                  className="bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-3 py-2 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                >
                  <span className="block text-green-300">{priceDetail.type}</span>
                  <span className="text-xs font-bold">₹ {priceDetail.price}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </CardHeader>
      <CardContent className='min-h-100'>
        <CardDescription>
          {description}
        </CardDescription>
      </CardContent>
      <CardContent className='min-h-100'>
        <Button className="w-full hover:shadow-2xl hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">Book Now</Button>
      </CardContent>
    </Card>
  );
};

interface EventsCardProps {
  events: Event[];
}

const EventsCard = ({ events }: EventsCardProps) => {
  return (
    <div className="m-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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