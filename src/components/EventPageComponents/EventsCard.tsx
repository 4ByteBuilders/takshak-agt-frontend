import React from 'react';
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
    <Card className="flex flex-col h-full rounded-lg transition duration-300 ease-in-out hover:border-stone-50">
      <div className="flex justify-center items-center">
        <img src={image[0]} alt={name} className="rounded-t-lg w-full h-40 object-cover" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <div className="flex-row sm:flex justify-between mt-2">
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
          <ul className="flex flex-row items-end sm:flex-col gap-4 mt-4">
            {price.map((priceDetail, idx) => (
              <li
                key={idx}
                className="flex flex-row items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              >
                <span className="text-green-300">{priceDetail.type}</span>
                <span className="text-xs font-bold">   ₹{priceDetail.price}</span>

              </li>
            ))}
          </ul>
        </div>
      </CardHeader>
      <CardContent className='min-h-[100px]'>
        <CardDescription>
          <p className="mt-2">{description}</p>
        </CardDescription>
      </CardContent>
      <CardContent>
        <Button className="w-full bg-green-50 transition duration-300 ease-in-out hover:shadow-2xl hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">Book Now</Button>
      </CardContent>
    </Card>
  );
};

interface EventsCardProps {
  events: Event[];
}

const EventsCard = ({ events }: EventsCardProps) => {
  return (
    <div className="m-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:mx-8 lg:mx-12">
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