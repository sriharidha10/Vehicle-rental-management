import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './pages/Home';
import VehicleList from './pages/VehicleList';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import AdminBookings from './pages/AdminBookings';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {/* Only show Navbar for non-admin routes */}
          {!window.location.pathname.includes('/admin') && <Navbar />}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/vehicles/:type" element={<VehicleList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Protected User Routes */}
            <Route path="/booking/:vehicleId" element={<BookingPage />} />
            <Route path="/bookings" element={<Bookings />} />
            
            {/* Admin Routes */}
            <Route path="/admin/bookings" element={<AdminBookings />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;