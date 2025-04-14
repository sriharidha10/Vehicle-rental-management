import React, { useState } from 'react';
import { createPayment, verifyPayment } from '../services/paymentService';
import '../styles/PaymentForm.css';

const PaymentForm = ({ booking, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentResponse = await createPayment({
        bookingId: booking._id,
        amount: booking.totalAmount,
        cardDetails
      });

      const verificationResponse = await verifyPayment(paymentResponse.paymentId);
      
      if (verificationResponse.status === 'success') {
        onSuccess(paymentResponse.paymentId);
      } else {
        onFailure('Payment verification failed');
      }
    } catch (error) {
      onFailure(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h3>Payment Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            maxLength="16"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails({
              ...cardDetails,
              cardNumber: e.target.value.replace(/\D/g, '')
            })}
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
              value={cardDetails.expiryDate}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                expiryDate: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>CVV</label>
            <input
              type="password"
              maxLength="3"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                cvv: e.target.value.replace(/\D/g, '')
              })}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="payment-button"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ₹${booking.totalAmount}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;