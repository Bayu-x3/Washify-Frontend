import Login from './pages/Login'
import Home from '../src/pages/dashboard/Home';

import Members from './pages/dashboard/members/Members';
import CreateMembers from './pages/dashboard/members/CreateMembers';
import EditMembers from './pages/dashboard/members/EditMembers';

import Outlets from './pages/dashboard/outlets/Outlets';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Home />} />

      <Route path="/dashboard/members" element={<Members />} />
      <Route path="/dashboard/members/create" element={<CreateMembers />} />
      <Route path="/dashboard/members/edit/:id" element={<EditMembers />} />


      <Route path="/dashboard/outlets" element={<Outlets />} />

      </Routes>
      </Router>
  )
}

export default App
