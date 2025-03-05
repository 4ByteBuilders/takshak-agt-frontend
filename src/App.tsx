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
              <ProtectedRoute>
                <Route path="/events" element={<EventPage />} />
              </ProtectedRoute>
              <ProtectedRoute>
                <Route path="/view/event" element={<EventView />} />
              </ProtectedRoute>
              <ProtectedRoute>
                <Route path="/verify" element={<Verify />} />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <Route path="/contact" element={<Contact />} />
              </ProtectedRoute>
              <ProtectedRoute>
                <Route path="/pending-booking" element={<Pending />} />
              </ProtectedRoute>
              <ProtectedRoute>
                <Route path="/tickets" element={<MyTickets />} />
              </ProtectedRoute>
              <ProtectedRoute>
                <Route path="/payment-status" element={<PaymentStatus />} />
              </ProtectedRoute>
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
