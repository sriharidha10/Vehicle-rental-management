import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    model: '',
    type: 'car',
    rentPerHour: '',
    capacity: '',
    imageUrl: '',
    fuelType: 'petrol',
    isAvailable: true
  });
  
  const navigate = useNavigate();

  // Setup axios interceptor for admin token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Set up axios interceptor for admin requests
    const interceptor = axios.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [navigate]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const fetchVehicles = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
      clearMessages();
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Error fetching vehicles: ' + (error.response?.data?.message || error.message));
      }
    }
  }, [navigate]);

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      console.log('Fetching all bookings...');
      const response = await axios.get('http://localhost:5000/api/bookings/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Bookings fetched:', response.data);
      setBookings(response.data);
      clearMessages();
    } catch (error) {
      console.error('Error fetching bookings:', error.response || error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Error fetching bookings: ' + (error.response?.data?.message || error.message));
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const initializeDashboard = async () => {
      setLoading(true);
      if (activeTab === 'vehicles') {
        await fetchVehicles();
      } else {
        await fetchBookings();
      }
      setLoading(false);
    };

    initializeDashboard();
  }, [activeTab, fetchVehicles, fetchBookings, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const validateVehicleData = () => {
    if (!newVehicle.name.trim()) {
      throw new Error('Vehicle name is required');
    }
    if (!newVehicle.model.trim()) {
      throw new Error('Vehicle model is required');
    }
    if (!newVehicle.rentPerHour || Number(newVehicle.rentPerHour) <= 0) {
      throw new Error('Please enter a valid rent per hour');
    }
    if (!newVehicle.capacity || Number(newVehicle.capacity) <= 0) {
      throw new Error('Please enter a valid capacity');
    }
    if (!newVehicle.imageUrl.trim()) {
      throw new Error('Image URL is required');
    }
    if (!newVehicle.type) {
      throw new Error('Vehicle type is required');
    }
    if (newVehicle.type !== 'bicycle' && !newVehicle.fuelType) {
      throw new Error('Fuel type is required for cars and bikes');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin authentication required');
      }

      validateVehicleData();

      const vehicleData = {
        name: newVehicle.name.trim(),
        model: newVehicle.model.trim(),
        type: newVehicle.type,
        rentPerHour: Number(newVehicle.rentPerHour),
        capacity: Number(newVehicle.capacity),
        imageUrl: newVehicle.imageUrl.trim(),
        fuelType: newVehicle.type === 'bicycle' ? undefined : newVehicle.fuelType,
        isAvailable: true
      };

      const response = await axios.post(
        'http://localhost:5000/api/vehicles',
        vehicleData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSuccess('Vehicle added successfully!');
        setShowAddVehicle(false);
        setNewVehicle({
          name: '',
          model: '',
          type: 'car',
          rentPerHour: '',
          capacity: '',
          imageUrl: '',
          fuelType: 'petrol',
          isAvailable: true
        });
        await fetchVehicles();
      }
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      clearMessages();
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Admin authentication required');
        }

        await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSuccess('Vehicle removed successfully!');
        await fetchVehicles();
      } catch (error) {
        setError('Error removing vehicle: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      clearMessages();
      setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      console.log(`Updating booking ${bookingId} to status: ${newStatus}`);

      const response = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Booking update response:', response.data);
      
      if (response.data) {
        setSuccess(`Booking ${newStatus.toLowerCase()} successfully`);
        // Update the booking in the local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId ? response.data : booking
          )
        );

        // Refresh vehicle list if booking status affects availability
        if (['confirmed', 'completed', 'cancelled'].includes(newStatus)) {
          await fetchVehicles();
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error.response || error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError(error.response?.data?.message || 'Error updating booking status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderBookingActions = (booking) => {
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return null;
    }

    return (
      <div className="booking-actions">
        {booking.status === 'pending' && (
          <>
            <button
              onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
              className="confirm-booking-button"
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
            <button
              onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
              className="cancel-booking-button"
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel'}
            </button>
          </>
        )}
        {booking.status === 'confirmed' && (
          <>
            <button
              onClick={() => handleBookingStatusUpdate(booking._id, 'completed')}
              className="complete-booking-button"
              disabled={loading}
            >
              {loading ? 'Completing...' : 'Mark as Completed'}
            </button>
            <button
              onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
              className="cancel-booking-button"
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel'}
            </button>
          </>
        )}
      </div>
    );
  };

  if (loading && vehicles.length === 0 && bookings.length === 0) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="admin-logout-button">
          Logout
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          Vehicles
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      {activeTab === 'vehicles' && (
        <div className="vehicles-section">
          <button
            className="add-vehicle-button"
            onClick={() => {
              setShowAddVehicle(!showAddVehicle);
              clearMessages();
            }}
          >
            {showAddVehicle ? 'Cancel' : 'Add New Vehicle'}
          </button>

          {showAddVehicle && (
            <form onSubmit={handleAddVehicle} className="add-vehicle-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newVehicle.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter vehicle name"
                />
              </div>
              <div className="form-group">
                <label>Model:</label>
                <input
                  type="text"
                  name="model"
                  value={newVehicle.model}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter model number"
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <select
                  name="type"
                  value={newVehicle.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="bicycle">Bicycle</option>
                </select>
              </div>
              {newVehicle.type !== 'bicycle' && (
                <div className="form-group">
                  <label>Fuel Type:</label>
                  <select
                    name="fuelType"
                    value={newVehicle.fuelType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Rent Per Hour (₹):</label>
                <input
                  type="number"
                  name="rentPerHour"
                  value={newVehicle.rentPerHour}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="Enter rent per hour"
                />
              </div>
              <div className="form-group">
                <label>Capacity:</label>
                <input
                  type="number"
                  name="capacity"
                  value={newVehicle.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="Enter capacity"
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newVehicle.imageUrl}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter image URL"
                />
              </div>
              <button 
                type="submit" 
                className="submit-vehicle-button" 
                disabled={loading}
              >
                {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
              </button>
            </form>
          )}

          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card">
                <img src={vehicle.imageUrl} alt={vehicle.name} />
                <div className="vehicle-details">
                  <h3>{vehicle.name}</h3>
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Type:</strong> {vehicle.type}</p>
                  {vehicle.type !== 'bicycle' && (
                    <p><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
                  )}
                  <p><strong>Rent:</strong> ₹{vehicle.rentPerHour}/hour</p>
                  <p><strong>Capacity:</strong> {vehicle.capacity}</p>
                  <p><strong>Status:</strong> {vehicle.isAvailable ? 'Available' : 'Not Available'}</p>
                  <button
                    onClick={() => handleRemoveVehicle(vehicle._id)}
                    className="remove-vehicle-button"
                  >
                    Remove Vehicle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-section">
          <div className="bookings-grid">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-details">
                    <h3>{booking.vehicle?.name || 'Vehicle Unavailable'}</h3>
                    <p><strong>Customer:</strong> {booking.user?.email || 'Unknown User'}</p>
                    <p><strong>From:</strong> {new Date(booking.startDate).toLocaleString()}</p>
                    <p><strong>To:</strong> {new Date(booking.endDate).toLocaleString()}</p>
                    <p><strong>Total Hours:</strong> {booking.totalHours}</p>
                    <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                    <p className={`booking-status ${booking.status.toLowerCase()}`}>
                      <strong>Status:</strong> {booking.status}
                    </p>
                    {renderBookingActions(booking)}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bookings">No bookings found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;