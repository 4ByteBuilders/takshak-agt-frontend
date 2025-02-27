import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/auth/Login'
import { Toaster } from "@/components/ui/sonner"
import Page404 from './pages/404/404'
import EventPage from './pages/EventPages/EventPage';
import { AuthProvider } from './lib/Providers/AuthProvider'
import Footer from './components/Footer/Footer'
import Contact from './pages/Policy/Contact'
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-full">
          <Navbar />
          <Toaster />
          <Routes>
            <Route path="/" element={<EventPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Page404 />} />
            <Route path="/privacy-policy" element={<div>Privacy Policy</div>} />
            <Route path="/terms-and-conditions" element={<div>Terms and Conditions</div>} />
            <Route path="/cancellation-and-refund" element={<div>Cancellation and Refund</div>} />
            <Route path="/shipping-and-delivery" element={<div>Shipping and Delivery</div>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;