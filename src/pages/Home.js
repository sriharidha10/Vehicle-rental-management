import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const vehicleTypes = [
    {
      type: 'car',
      name: 'Cars',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500',
      alt: 'Car'
    },
    {
      type: 'bike',
      name: 'Bikes',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
      alt: 'Bike'
    },
    {
      type: 'bicycle',
      name: 'Bicycles',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500',
      alt: 'Bicycle'
    }
  ];

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Vehicle Rent Management</h1>
        <p>Choose your preferred mode of transport</p>
      </div>

      <div className="vehicle-types">
        {vehicleTypes.map((vehicle) => (
          <Link 
            key={vehicle.type} 
            to={`/vehicles/${vehicle.type}`} 
            className="vehicle-type"
          >
            <div className="vehicle-image">
              <img 
                src={vehicle.image} 
                alt={vehicle.alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500';
                }}
              />
            </div>
            <h3>{vehicle.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;