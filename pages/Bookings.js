import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Bookings.css';

const ITEMS_PER_PAGE = 6;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Error loading bookings');
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError(error.response?.data?.message || 'Error cancelling booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: 'confirmed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError(error.response?.data?.message || 'Error confirming booking');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <div className="pagination-numbers">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchBookings} className="browse-vehicles" style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="header-container">
        <h2>My Bookings</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <button onClick={() => navigate('/')} className="browse-vehicles">
            Browse Vehicles
          </button>
        </div>
      ) : (
        <>
          <div className="bookings-grid">
            {currentBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="vehicle-image">
                  <img src={booking.vehicle.imageUrl} alt={booking.vehicle.name} />
                </div>
                <div className="booking-details">
                  <h3>{booking.vehicle.name}</h3>
                  <div className="booking-info">
                    <p>
                      <strong>Model:</strong>
                      <span>{booking.vehicle.model}</span>
                    </p>
                    <p>
                      <strong>Start Date:</strong>
                      <span>{formatDate(booking.startDate)}</span>
                    </p>
                    <p>
                      <strong>End Date:</strong>
                      <span>{formatDate(booking.endDate)}</span>
                    </p>
                    <p>
                      <strong>Total Hours:</strong>
                      <span>{booking.totalHours}</span>
                    </p>
                    <p>
                      <strong>Total Amount:</strong>
                      <span>{formatAmount(booking.totalAmount)}</span>
                    </p>
                  </div>
                  <div className="booking-status-container">
                    <div className={`booking-status ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    {booking.status.toLowerCase() === 'pending' && (
                      <div className="booking-actions">
                        <button 
                          onClick={() => handlePayment(booking._id)}
                          className="pay-button"
                        >
                          Pay {formatAmount(booking.totalAmount)}
                        </button>
                        <button 
                          onClick={() => handleCancel(booking._id)}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderPaginationControls()}
        </>
      )}
    </div>
  );
};

export default Bookings;