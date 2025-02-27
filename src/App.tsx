import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/auth/Login'
import { Toaster } from "@/components/ui/sonner"
import Page404 from './pages/404/404'
import EventPage from './pages/EventPages/EventPage';
import { AuthProvider } from './lib/Providers/AuthProvider'
import PrivacyPolicyPage from './pages/privacyPolicy/PrivacyPolicyPage'
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-full">
          <Navbar />
          <Toaster />
          <Routes>
            <Route path="/" element={<EventPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;