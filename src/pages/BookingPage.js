import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [booking, setBooking] = useState(false);
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!vehicleId) {
          console.error('No vehicle ID in URL parameters');
          setError('No vehicle ID provided');
          setVehicle(null);
          setLoading(false);
          return;
        }

        console.log('Fetching vehicle with ID:', vehicleId);
        
        // Set authorization header for the request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
        console.log('Vehicle data received:', response.data);
        
        if (response.data) {
          if (!response.data.isAvailable) {
            setError('This vehicle is currently not available for booking');
          }
          setVehicle(response.data);
        } else {
          setError('Vehicle not found');
          setVehicle(null);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error.response || error);
        if (error.response?.status === 404) {
          setError('Vehicle not found');
        } else {
          setError(error.response?.data?.message || 'Error loading vehicle details. Please try again.');
        }
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, navigate]);

  const calculateTotal = () => {
    if (!vehicle.isAvailable) {
      setError('This vehicle is currently not available for booking');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setCalculating(true);
    setError('');

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        setError('End date must be after start date');
        return;
      }

      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      if (hours <= 0) {
        setError('Invalid time range');
        return;
      }

      const amount = hours * vehicle.rentPerHour;
      setTotalAmount(amount);
    } catch (error) {
      setError('Error calculating total. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  const handleBooking = async () => {
    if (!vehicleId) {
      console.error('No vehicle ID available');
      setError('No vehicle ID provided');
      return;
    }

    if (!vehicle || !vehicle.isAvailable) {
      setError('This vehicle is currently not available for booking');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      setBooking(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        setError('End date must be after start date');
        return;
      }

      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      const amount = hours * vehicle.rentPerHour;

      // Configure axios with default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const bookingData = {
        vehicleId: vehicleId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalHours: hours,
        totalAmount: amount
      };

      console.log('Sending booking request with data:', bookingData);

      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData
      );

      console.log('Booking response:', response.data);

      if (response.data) {
        navigate('/bookings');
      }
    } catch (error) {
      console.error('Error creating booking:', error.response || error);
      if (error.response?.status === 404) {
        setError('Vehicle not found');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid booking request');
      } else {
        setError(error.response?.data?.message || 'Error creating booking. Please try again.');
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="booking-page">
        <div className="error">
          <p>{error || 'Vehicle not found'}</p>
          <button onClick={() => navigate('/vehicles/car')} className="back-btn">
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="vehicle-details">
        <div className="image-container">
          <img 
            src={vehicle.imageUrl} 
            alt={vehicle.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Vehicle+Image';
            }}
          />
          {!vehicle.isAvailable && (
            <div className="not-available-badge">Not Available</div>
          )}
        </div>
        <div className="details">
          <h2>{vehicle.name}</h2>
          <p className="model">Model: {vehicle.model}</p>
          <p className="fuel-type">Fuel Type: {vehicle.fuelType || 'N/A'}</p>
          <p className="capacity">Capacity: {vehicle.capacity} {vehicle.capacity === 1 ? 'person' : 'persons'}</p>
          <p className="rent">Rent per hour: ₹{vehicle.rentPerHour}</p>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <div className="booking-form">
        <h3>Select Booking Time</h3>
        <div className="date-pickers">
          <div className="form-group">
            <label>Start Date & Time:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setTotalAmount(0);
                setError('');
              }}
              min={new Date().toISOString().slice(0, 16)}
              className="datetime-input"
              disabled={!vehicle.isAvailable}
            />
          </div>
          <div className="form-group">
            <label>End Date & Time:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setTotalAmount(0);
                setError('');
              }}
              min={startDate || new Date().toISOString().slice(0, 16)}
              className="datetime-input"
              disabled={!vehicle.isAvailable}
            />
          </div>
        </div>

        {startDate && endDate && (
          <button 
            onClick={calculateTotal}
            className="calculate-btn"
            disabled={calculating || !vehicle.isAvailable}
          >
            {calculating ? 'Calculating...' : 'Calculate Total'}
          </button>
        )}

        {totalAmount > 0 && (
          <div className="total-section">
            <h4>Total Amount: ₹{totalAmount}</h4>
            <button 
              onClick={handleBooking}
              className="book-btn"
              disabled={booking || !vehicle.isAvailable}
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;