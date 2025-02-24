import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/ui/Navbar/Navbar'
import Login from './pages/auth/Login'
import HomePage from './pages/home/HomePage'
import EventPage from './pages/EventPages/EventPage';
function App() {
  return (
    <BrowserRouter>
      <div className='h-full'>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<EventPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;