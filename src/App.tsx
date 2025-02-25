import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/ui/Navbar/Navbar'
import Login from './pages/auth/Login'
import HomePage from './pages/home/HomePage'
import Page404 from './pages/404/404'
import EventPage from './pages/EventPages/EventPage';
function App() {
  return (
    <BrowserRouter>
      <div className="h-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;