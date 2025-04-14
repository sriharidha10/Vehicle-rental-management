import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminBookings.css';

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            const response = await axios.get('/api/admin/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched bookings:', response.data);
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Failed to fetch bookings');
            setLoading(false);
            if (error.response?.status === 401) {
                navigate('/admin/login');
            }
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            setUpdating(true);
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/bookings/${bookingId}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            // Refresh bookings list
            await fetchBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }
        
        try {
            setUpdating(true);
            const token = localStorage.getItem('token');
            await axios.post(`/api/admin/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh bookings list
            await fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return (
        <div className="admin-bookings">
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading bookings...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-bookings">
            <div className="error">
                <p>{error}</p>
                <button onClick={fetchBookings} className="retry-btn">
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-bookings">
            <h2>Manage Bookings</h2>
            {bookings.length === 0 ? (
                <p className="no-bookings">No bookings found</p>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-header">
                                <h3>{booking.vehicle?.name || 'Vehicle Unavailable'}</h3>
                                <span className={`status ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="booking-details">
                                <p><strong>User:</strong> {booking.user?.email || 'Unknown'}</p>
                                <p><strong>From:</strong> {formatDate(booking.startDate)}</p>
                                <p><strong>To:</strong> {formatDate(booking.endDate)}</p>
                                <p><strong>Total Hours:</strong> {booking.totalHours}</p>
                                <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                            </div>
                            <div className="booking-actions">
                                {booking.status === 'pending' && (
                                    <>
                                        <button 
                                            className="confirm-btn"
                                            onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                            disabled={updating}
                                        >
                                            Confirm Booking
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={() => handleCancelBooking(booking._id)}
                                            disabled={updating}
                                        >
                                            Cancel Booking
                                        </button>
                                    </>
                                )}
                                {booking.status === 'confirmed' && (
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => handleCancelBooking(booking._id)}
                                        disabled={updating}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminBookings; 