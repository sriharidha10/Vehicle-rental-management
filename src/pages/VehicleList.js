import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/VehicleList.css';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        console.log('Fetching vehicles for type:', type);
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/vehicles/type/${type}`);
        console.log('API Response:', response);
        
        if (response.data) {
          console.log('Fetched vehicles:', response.data);
          setVehicles(response.data);
          setError(null);
        } else {
          console.error('No data in response');
          setError('No vehicles found');
        }
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(err.response?.data?.message || 'Failed to fetch vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchVehicles();
    } else {
      console.error('No vehicle type provided');
      setError('Invalid vehicle type');
      setLoading(false);
    }
  }, [type]);

  const handleBookNow = (vehicleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    console.log('Booking vehicle with ID:', vehicleId);
    
    if (!vehicleId) {
      console.error('No vehicle ID provided');
      return;
    }
    
    navigate(`/booking/${vehicleId}`);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="vehicle-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading {type}s...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicle-list-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-list-container">
      <h1>{capitalizeFirstLetter(type)}s Available</h1>
      
      {vehicles.length === 0 ? (
        <div className="no-vehicles">
          <p>No {type}s available at the moment.</p>
          <p>Please check back later or try a different category.</p>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Back to Home
          </button>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">
              <div className="vehicle-image-container">
                <img 
                  src={vehicle.imageUrl}
                  alt={`${vehicle.name} ${vehicle.model}`}
                  className="vehicle-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop';
                  }}
                />
                {!vehicle.isAvailable && (
                  <div className="not-available-badge">
                    Not Available
                  </div>
                )}
              </div>
              <div className="vehicle-details">
                <h2>{vehicle.name}</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Model:</span>
                    <span className="detail-value">{vehicle.model}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fuel Type:</span>
                    <span className="detail-value">{vehicle.fuelType || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{vehicle.capacity} {vehicle.capacity === 1 ? 'person' : 'persons'}</span>
                  </div>
                  <div className="detail-item rent">
                    <span className="detail-label">Rent:</span>
                    <span className="detail-value">{formatCurrency(vehicle.rentPerHour)}/hour</span>
                  </div>
                </div>
                <button 
                  className="book-now-btn"
                  onClick={() => handleBookNow(vehicle._id)}
                  disabled={!vehicle.isAvailable}
                >
                  {vehicle.isAvailable ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VehicleList;