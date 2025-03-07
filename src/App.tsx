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
import Profile from "./pages/Profile/Profile";
import AdminLayout from "./layouts/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddVerifiersPage from "./pages/admin/AddVerifiersPage";
import ViewMessagesPage from "./pages/admin/ViewMessagesPage";

const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split(".");
  return parts.length > 2 ? parts[0] : null; // Assumes format like "admin.mywebsite.com"
};

function App() {
  const subdomain = getSubdomain();
  const isAdminRoute = location.pathname.includes("admin"); //remove once subdomain added

  return (
    <BrowserRouter>
      <EventProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen font-poppins">
            <Toaster />
            {subdomain === "admin" ? (
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminLoginPage />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/add-verifiers" element={<AddVerifiersPage />} />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </AdminLayout>
            ) : (
              <>
                {!isAdminRoute && <Navbar />}
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/events" element={<EventPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/view-event" element={<EventView />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/pending-booking" element={<Pending />} />
                    <Route path="/tickets" element={<MyTickets />} />
                    <Route path="/payment-status" element={<PaymentStatus />} />
                    <Route path="/booking-history" element={<History />} />
                    {/* Temporary : Need to remove */}
                    <Route path="/admin" element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/add-verifiers" element={<AddVerifiersPage />} />
                    <Route path="/admin/view-messages" element={<ViewMessagesPage />} />
                    <Route path="*" element={<Page404 />} />
                  </Routes>
                </div>
                {!isAdminRoute && <Footer />}
              </>
            )}
          </div>
        </AuthProvider>
      </EventProvider>
    </BrowserRouter>
  );
}

export default App;