import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EventPage from './pages/EventPages/EventPage';
import Login from './pages/auth/login';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<EventPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;