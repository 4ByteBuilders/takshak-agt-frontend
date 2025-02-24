import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/ui/Navbar/Navbar'
import Login from './pages/auth/login'
import HomePage from './pages/home/HomePage'
import Page404 from './pages/404/404'
import EventPage from './pages/EventPages/EventPage';
function App() {
  return (
    <BrowserRouter>
      <div className="h-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<EventPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Page404 />} /> {/* Redirect to home if no matching route found */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;