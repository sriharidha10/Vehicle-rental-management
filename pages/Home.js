import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const vehicleTypes = [
    {
      type: 'car',
      name: 'Cars',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      alt: 'Car',
      description: 'Experience comfort and luxury with our wide range of cars. Perfect for family trips, business travel, or special occasions.'
    },
    {
      type: 'bike',
      name: 'Bikes',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
      alt: 'Bike',
      description: 'Explore the city with our powerful bikes. Ideal for solo riders and adventures, with great mileage and easy handling.'
    },
    {
      type: 'bicycle',
      name: 'Bicycles',
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800',
      alt: 'Bicycle',
      description: 'Go eco-friendly with our bicycles. Perfect for short trips, exercise, and enjoying the outdoors.'
    }
  ];

  const offers = [
    {
      title: "Early Bird Discount",
      description: "Get 15% off on bookings made 7 days in advance",
      code: "EARLY15",
      icon: "🌅"
    },
    {
      title: "Weekend Special",
      description: "10% discount on weekend rentals",
      code: "WEEKEND10",
      icon: "🎉"
    },
    {
      title: "Long Term Rental",
      description: "Special rates for rentals over 7 days",
      code: "LONG7",
      icon: "📅"
    }
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <div className="company-brand">
            <img 
              src="https://i.ibb.co/wQh5YZV/rental-logo.png" 
              alt="Oviya Rental Logo" 
              className="company-logo"
              style={{
                maxWidth: '180px',
                height: 'auto',
                marginBottom: '1rem',
                filter: 'brightness(0) invert(1)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDcyZmYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+T1I8L3RleHQ+PC9zdmc+';
              }}
            />
            <h1>Oviya Rental</h1>
          </div>
          <p className="hero-subtitle">Your Journey, Our Priority</p>
          <div className="hero-cta">
            <Link to="/vehicles" className="cta-button">Explore Vehicles</Link>
            <Link to="/about" className="cta-button secondary">About Us</Link>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      <section className="offers-section">
        <h2>Special Offers</h2>
        <div className="offers-container">
          {offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <span className="offer-icon">{offer.icon}</span>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="offer-code">
                Use code: <span>{offer.code}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vehicle-section">
        <h2>Choose Your Ride</h2>
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
                  loading="lazy"
                />
              </div>
              <div className="vehicle-content">
                <h3>{vehicle.name}</h3>
                <p className="vehicle-description">{vehicle.description}</p>
                <span className="explore-btn">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Why Choose Us</h2>
        <div className="service-highlights">
          <div className="highlight">
            <span className="highlight-icon">🔒</span>
            <h3>Safe & Secure</h3>
            <p>All vehicles regularly maintained and sanitized for your safety</p>
          </div>
          <div className="highlight">
            <span className="highlight-icon">💰</span>
            <h3>Best Rates</h3>
            <p>Competitive pricing with no hidden charges guaranteed</p>
          </div>
          <div className="highlight">
            <span className="highlight-icon">🚗</span>
            <h3>Wide Selection</h3>
            <p>From luxury cars to eco-friendly options, find your perfect ride</p>
          </div>
          <div className="highlight">
            <span className="highlight-icon">⚡</span>
            <h3>Quick Booking</h3>
            <p>Easy and fast booking process with instant confirmation</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h3>24/7 Support</h3>
                <p>+1 (555) 123-4567</p>
                <p>Always here to help</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <h3>Email Us</h3>
                <p>support@oviyarental.com</p>
                <p>Quick response guaranteed</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h3>Visit Us</h3>
                <p>123 Rental Street</p>
                <p>Vehicle City, VC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;