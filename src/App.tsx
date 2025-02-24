import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from './components/ui/login'

function App() {
  return (  
    <BrowserRouter>
        <div>
          <Routes>
            <Route path = "/login" element = {<Login/>} /> 
          </Routes>
        </div>
    </BrowserRouter>
  )
}

export default App