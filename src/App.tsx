import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/ui/Navbar/navbar'
import Login from './pages/auth/login'
import { createClient } from "@supabase/supabase-js";

// const supabase = createClient("https://<project>.supabase.co", "<your-anon-key>");

function App() {
  return (
    <BrowserRouter>
      <div className='h-full'>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App