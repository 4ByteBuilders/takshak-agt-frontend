import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/auth/Login";
import { Toaster } from "@/components/ui/sonner";
import Page404 from "./pages/404/404";
import EventPage from "./pages/EventPages/EventPage";
import { AuthProvider } from "./lib/Providers/AuthProvider";
import Footer from "./components/Footer/Footer";
import Contact from "./pages/Policy/Contact";
import TermsAndCondition from "./pages/Policy/TermsAndCondition";
import CancellationAndRefund from "./pages/Policy/CancellationAndRefund";
import PrivacyPolicy from "./pages/Policy/PrivacyPolicy";
import AboutUs from "./pages/Policy/AboutUs";
import HomePage from "./pages/home/HomePage";
import EventView from "./pages/EventPages/EventView";
import Verify from "./pages/verify/Verify";
import Pending from "./pages/PendingBooking/Pending";
import MyTickets from "./pages/ConfirmedTickets/MyTickets";

interface SelectedTickets {
  [key: string]: number;
}

function App() {
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({});
  const [ticketsLocked, setTicketsLocked] = useState<boolean>(false);
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-full">
          <Navbar />
          <Toaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<EventPage />} />
            <Route
              path="/view/event"
              element={
                <EventView
                  selectedTickets={selectedTickets}
                  setSelectedTickets={setSelectedTickets}
                  ticketsLocked={ticketsLocked}
                  setTicketsLocked={setTicketsLocked}
                />
              }
            />
            <Route path="/verify" element={<Verify />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndCondition />}
            />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/cancellation-and-refund"
              element={<CancellationAndRefund />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pending-booking" element={<Pending />} />
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
