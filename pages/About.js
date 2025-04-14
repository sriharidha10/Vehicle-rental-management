import React from 'react';
import '../styles/About.css';

function About() {
  const milestones = [
    {
      year: "2018",
      title: "Our Beginning",
      description: "Founded with just 5 vehicles, Oviya Rental started its journey to revolutionize the vehicle rental industry."
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched our online booking platform, making vehicle rentals more accessible than ever."
    },
    {
      year: "2023",
      title: "Expansion",
      description: "Expanded our fleet to over 100 vehicles and opened branches in multiple cities."
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Oviya Rental</h1>
          <p>Driving Dreams, Delivering Excellence</p>
        </div>
      </section>

      <section className="about-story">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>Founded in 2018, Oviya Rental has grown from a small local business to one of the most trusted names in vehicle rentals. Our journey began with a simple mission: to provide reliable, affordable, and hassle-free vehicle rental services to everyone.</p>
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200" alt="Luxury car fleet" className="story-image" />
          <p>With years of experience in the automotive industry, we understand that each customer has unique needs. Whether you're planning a family vacation, a business trip, or need a temporary vehicle, we have the perfect solution for you.</p>
        </div>
      </section>

      <section className="about-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1552960562-daf630e9278b?w=800" alt="Quality service" />
            <h3>Quality First</h3>
            <p>We maintain our vehicles to the highest standards, ensuring your safety and comfort.</p>
          </div>
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800" alt="Customer satisfaction" />
            <h3>Customer Satisfaction</h3>
            <p>Your satisfaction is our top priority. We go above and beyond to exceed your expectations.</p>
          </div>
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800" alt="Innovation" />
            <h3>Innovation</h3>
            <p>We continuously evolve our services to meet the changing needs of our customers.</p>
          </div>
        </div>
      </section>

      <section className="fleet-showcase">
        <h2>Our Premium Fleet</h2>
        <div className="fleet-grid">
          <img src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800" alt="Luxury car" />
          <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800" alt="Sports car" />
          <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800" alt="Electric car" />
          <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800" alt="Vintage car" />
        </div>
      </section>

      <section className="milestones">
        <h2>Our Journey</h2>
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="milestone-card">
              <div className="year">{milestone.year}</div>
              <h3>{milestone.title}</h3>
              <p>{milestone.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" alt="CEO" />
            <h3>John Smith</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" alt="COO" />
            <h3>Sarah Johnson</h3>
            <p>Chief Operations Officer</p>
          </div>
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" alt="CTO" />
            <h3>Michael Chen</h3>
            <p>Chief Technology Officer</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About; 