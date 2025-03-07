import { useState } from "react";
import HomePagePreview from "./preview/HomePagePreview";
import LoginPagePreview from "./preview/LoginPagePreview";
import EventPagePreview from "./preview/EventPagePreview";

export default function CreateEventPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [eventData, setEventData] = useState({
    title: "",
    dateTime: "",
    venue: "",
    homePageImg: "",
    description: "",
    totalNumberOfTickets: 0,
    priceOfferings: [] as { name: string; price: string; capacity: string }[],
    eventPageImg: "",
    loginPageImg: "",
  });

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    setPageNumber((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setPageNumber((prevPage) => prevPage - 1);
  };

  const handleAddPriceOffering = () => {
    setEventData((prevData) => ({
      ...prevData,
      priceOfferings: [...prevData.priceOfferings, { name: "", price: "", capacity: "" }],
    }));
  };

  const handleRemovePriceOffering = (index: number) => {
    setEventData((prevData) => ({
      ...prevData,
      priceOfferings: prevData.priceOfferings.filter((_, i) => i !== index),
    }));
  };

  const handlePriceOfferingChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPriceOfferings = eventData.priceOfferings.map((offering, i) =>
      i === index ? { ...offering, [name]: value } : offering
    );
    setEventData((prevData) => ({ ...prevData, priceOfferings: updatedPriceOfferings }));
  };

  return (
    <div className="flex flex-row h-full">
      <div className="h-screen bg-white border" style={{ width: '70%' }}>
        {pageNumber === 1 && <HomePagePreview event={{ dateTime: eventData.dateTime, title: eventData.title, homePageImg: eventData.homePageImg }} />}
        {pageNumber === 2 && <EventPagePreview event={{
            title: eventData.title,
            dateTime: eventData.dateTime,
            venue: eventData.venue,
            description: eventData.description,
            totalNumberOfTickets: eventData.totalNumberOfTickets,
            priceOfferings: eventData.priceOfferings,
            eventImgUrl: eventData.eventPageImg,
        }} />}
        {pageNumber === 3 && <LoginPagePreview />}
      </div>
      <div className="flex-grow h-full p-6 bg-gray-100">
        {pageNumber === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Create Event</h1>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date and Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={eventData.dateTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Venue</label>
              <input
                type="text"
                name="venue"
                value={eventData.venue}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Home Page Image URL</label>
              <input
                type="text"
                name="homePageImg"
                value={eventData.homePageImg}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 transition-all text-white font-semibold rounded-md"
                disabled={pageNumber === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {pageNumber === 2 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Event Details</h1>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total Number of Tickets</label>
              <input
                type="number"
                name="totalNumberOfTickets"
                value={eventData.totalNumberOfTickets}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price Offerings</label>
              {eventData.priceOfferings.map((offering, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={offering.name}
                    onChange={(e) => handlePriceOfferingChange(index, e)}
                    className="w-1/3 p-2 border border-gray-300 rounded-lg bg-white text-black mr-2"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={offering.price}
                    onChange={(e) => handlePriceOfferingChange(index, e)}
                    className="w-1/3 p-2 border border-gray-300 rounded-lg bg-white text-black mr-2"
                  />
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={offering.capacity}
                    onChange={(e) => handlePriceOfferingChange(index, e)}
                    className="w-1/3 p-2 border border-gray-300 rounded-lg bg-white text-black"
                  />
                  <button
                    onClick={() => handleRemovePriceOffering(index)}
                    className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 transition-all text-white font-semibold rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddPriceOffering}
                className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded-md"
              >
                Add Price Offering
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Event Page Image URL</label>
              <input
                type="text"
                name="eventPageImg"
                value={eventData.eventPageImg}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 transition-all text-white font-semibold rounded-md"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {pageNumber === 3 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Login Page Image</h1>
            <div className="mb-4">
              <label className="block text-gray-700">Login Page Image URL</label>
              <input
                type="text"
                name="loginPageImg"
                value={eventData.loginPageImg}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 transition-all text-white font-semibold rounded-md"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}