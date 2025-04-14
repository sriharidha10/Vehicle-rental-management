import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    upcomingBookings: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p className="stat-number">{stats.activeBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-number">₹{stats.totalSpent}</p>
        </div>
      </div>

      <div className="upcoming-bookings">
        <h2>Upcoming Bookings</h2>
        <div className="bookings-list">
          {stats.upcomingBookings.map(booking => (
            <div key={booking._id} className="booking-item">
              <img src={booking.vehicle.imageUrl} alt={booking.vehicle.name} />
              <div className="booking-info">
                <h3>{booking.vehicle.name}</h3>
                <p>Start: {new Date(booking.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(booking.endDate).toLocaleDateString()}</p>
                <Link to={`/bookings/${booking._id}`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;