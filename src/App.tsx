import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import History from "./pages/TicketHistory/History";
import { EventProvider } from "./lib/Providers/EventProvider";
import PaymentStatus from "./pages/Payment/PaymentStatus";
import ProtectedRoute from "./components/Wrapper/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <EventProvider>
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
                  <ProtectedRoute>
                    <EventView />
                  </ProtectedRoute>
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
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route path="/booking-history" element={<History />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
            <Footer />
          </div>
        </AuthProvider>
      </EventProvider>
    </BrowserRouter>
  );
}

export default App;
