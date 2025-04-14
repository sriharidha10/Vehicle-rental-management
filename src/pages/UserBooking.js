import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../styles/UserBookings.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-bookings">
      <h2>My Bookings</h2>
      <div className="bookings-container">
        {bookings.map(booking => (
          <div key={booking._id} className="booking-card">
            <div className="vehicle-image">
              <img src={booking.vehicle.imageUrl} alt={booking.vehicle.name} />
            </div>
            <div className="booking-details">
              <h3>{booking.vehicle.name}</h3>
              <p>From: {moment(booking.startDate).format('MMMM Do YYYY, h:mm a')}</p>
              <p>To: {moment(booking.endDate).format('MMMM Do YYYY, h:mm a')}</p>
              <p>Total Amount: ₹{booking.totalAmount}</p>
              <p className={`status ${booking.status}`}>Status: {booking.status}</p>
              {booking.status === 'pending' && (
                <button 
                  onClick={() => handleCancelBooking(booking._id)}
                  className="cancel-btn"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;