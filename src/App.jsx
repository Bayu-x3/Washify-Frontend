import Login from './pages/Login'
import Home from '../src/pages/dashboard/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Home />} />
      </Routes>
      </Router>
  )
}

export default App
