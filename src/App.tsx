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
function App() {
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
            <Route path="/view/event" element={<EventView />} />
            <Route path="*" element={<Page404 />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              element={<TermsAndCondition />}
              path="/terms-and-conditions"
            />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/cancellation-and-refund"
              element={<CancellationAndRefund />}
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
