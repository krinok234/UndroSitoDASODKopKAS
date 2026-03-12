import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Rules } from './pages/Rules';
import { CursorParticles } from './components/CursorParticles';

function App() {
  return (
    <AuthProvider>
      <CursorParticles />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rules" element={<Rules />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
