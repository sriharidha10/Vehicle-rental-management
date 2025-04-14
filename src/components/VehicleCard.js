import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="vehicle-card">
      <img src={vehicle.imageUrl} alt={vehicle.name} />
      <div className="vehicle-info">
        <h3>{vehicle.name}</h3>
        <p>Model: {vehicle.model}</p>
        <p>Rent per hour: ₹{vehicle.rentPerHour}</p>
        {vehicle.fuelType && <p>Fuel Type: {vehicle.fuelType}</p>}
        <p>Capacity: {vehicle.capacity} persons</p>
        <Link to={`/booking/${vehicle._id}`} className="book-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;