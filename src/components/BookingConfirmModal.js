import React from 'react';
import moment from 'moment';
import '../styles/BookingConfirmModal.css';

const BookingConfirmModal = ({ booking, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Booking</h2>
        <div className="booking-summary">
          <div className="vehicle-info">
            <img src={booking.vehicle.imageUrl} alt={booking.vehicle.name} />
            <h3>{booking.vehicle.name}</h3>
          </div>
          
          <div className="booking-details">
            <p>
              <strong>Start Date:</strong> 
              {moment(booking.startDate).format('MMMM Do YYYY, h:mm a')}
            </p>
            <p>
              <strong>End Date:</strong> 
              {moment(booking.endDate).format('MMMM Do YYYY, h:mm a')}
            </p>
            <p>
              <strong>Total Hours:</strong> {booking.totalHours}
            </p>
            <p>
              <strong>Rate per Hour:</strong> ₹{booking.vehicle.rentPerHour}
            </p>
            <p className="total-amount">
              <strong>Total Amount:</strong> ₹{booking.totalAmount}
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm Booking
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmModal;