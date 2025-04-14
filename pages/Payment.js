import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

function Payment({ bookingDetails }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="payment-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed.</p>
          <p>Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-form-container">
        <h2>Complete Your Payment</h2>
        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label>Card Number</label>
            <input 
              type="text" 
              placeholder="1234 5678 9012 3456"
              maxLength="16"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input 
                type="text" 
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Card Holder Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`payment-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment; 