import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedRoute.jsx';
import Catalogo from './pages/Catalogo.jsx';
import AdminPanel from './adminPanel.jsx';
import Login from './login.jsx';


function RutaPrivada({ children }){
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/login"/>;
}


function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Catalogo/>} />
        <Route path="/admin" element={
          <RutaPrivada>
            <AdminPanel/>
        </RutaPrivada>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;