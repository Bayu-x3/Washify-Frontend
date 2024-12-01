import Login from './pages/Login'
import Home from '../src/pages/dashboard/Home';
import Members from './pages/dashboard/members/Members';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/dashboard/members" element={<Members />} />
      </Routes>
      </Router>
  )
}

export default App
