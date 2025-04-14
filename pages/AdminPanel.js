import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: 'car',
    name: '',
    model: '',
    rentPerHour: '',
    capacity: '',
    fuelType: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      if (activeTab === 'vehicles') {
        const response = await axios.get('http://localhost:5000/api/admin/vehicles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(response.data);
      } else if (activeTab === 'bookings') {
        const response = await axios.get('http://localhost:5000/api/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/admin/vehicles', newVehicle, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddVehicle(false);
      fetchData();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'vehicles' ? 'active' : ''} 
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''} 
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'vehicles' && (
          <div className="vehicles-section">
            <button onClick={() => setShowAddVehicle(true)}>Add New Vehicle</button>
            <div className="vehicles-grid">
              {vehicles.map(vehicle => (
                <div key={vehicle._id} className="vehicle-card">
                  <img src={vehicle.imageUrl} alt={vehicle.name} />
                  <div className="vehicle-info">
                    <h3>{vehicle.name}</h3>
                    <p>Type: {vehicle.type}</p>
                    <p>Rent: ₹{vehicle.rentPerHour}/hr</p>
                    <button onClick={() => handleDeleteVehicle(vehicle._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Vehicle</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.user.username}</td>
                    <td>{booking.vehicle.name}</td>
                    <td>{new Date(booking.startDate).toLocaleString()}</td>
                    <td>{new Date(booking.endDate).toLocaleString()}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddVehicle && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle}>
              <select 
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="bicycle">Bicycle</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
              />
              <input
                type="number"
                placeholder="Rent per hour"
                value={newVehicle.rentPerHour}
                onChange={(e) => setNewVehicle({...newVehicle, rentPerHour: e.target.value})}
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({...newVehicle, capacity: e.target.value})}
              />
              <input
                type="text"
                placeholder="Fuel Type"
                value={newVehicle.fuelType}
                onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newVehicle.imageUrl}
                onChange={(e) => setNewVehicle({...newVehicle, imageUrl: e.target.value})}
              />
              <button type="submit">Add Vehicle</button>
              <button type="button" onClick={() => setShowAddVehicle(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;