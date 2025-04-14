const mongoose = require('mongoose');
const Vehicle = require('./models/vehicleModel');

// MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017/vehicle-rent';

const vehicles = [
  {
    name: "Honda Civic",
    model: "2022",
    type: "car",
    rentPerHour: 45,
    capacity: 5,
    fuelType: "Petrol",
    imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500",
    isAvailable: true
  },
  {
    name: "Yamaha MT-15",
    model: "2023",
    type: "bike",
    rentPerHour: 25,
    capacity: 2,
    fuelType: "Petrol",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500",
    isAvailable: true
  },
  {
    name: "Royal Enfield Classic",
    model: "2022",
    type: "bike",
    rentPerHour: 30,
    capacity: 2,
    fuelType: "Petrol",
    imageUrl: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=500",
    isAvailable: true
  },
  {
    name: "Giant Escape",
    model: "2023",
    type: "bicycle",
    rentPerHour: 10,
    capacity: 1,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
    isAvailable: true
  },
  {
    name: "Trek FX",
    model: "2023",
    type: "bicycle",
    rentPerHour: 8,
    capacity: 1,
    imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500",
    isAvailable: true
  }
];

async function addVehicles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');

    // Add new vehicles
    const result = await Vehicle.insertMany(vehicles);
    console.log('Added vehicles:', result);

    console.log('All vehicles added successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
addVehicles(); 