import Login from './pages/Login'
import Home from '../src/pages/dashboard/Home';

import Members from './pages/dashboard/members/Members';
import CreateMembers from './pages/dashboard/members/CreateMembers';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Home />} />

      <Route path="/dashboard/members" element={<Members />} />
      <Route path="/dashboard/members/create" element={<CreateMembers />} />

      </Routes>
      </Router>
  )
}

export default App
