const mongoose = require('mongoose');
const Vehicle = require('./models/vehicleModel');

const sampleVehicles = [
    {
        name: "Toyota Camry",
        model: "2022",
        type: "car",
        rentPerHour: 50,
        capacity: 5,
        fuelType: "Petrol",
        imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
        isAvailable: true
    },
    {
        name: "Honda Civic",
        model: "2021",
        type: "car",
        rentPerHour: 45,
        capacity: 5,
        fuelType: "Petrol",
        imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500",
        isAvailable: true
    },
    {
        name: "Tesla Model 3",
        model: "2023",
        type: "car",
        rentPerHour: 75,
        capacity: 5,
        fuelType: "Electric",
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
        isAvailable: true
    },
    {
        name: "Royal Enfield Classic",
        model: "2022",
        type: "bike",
        rentPerHour: 25,
        capacity: 2,
        fuelType: "Petrol",
        imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500",
        isAvailable: true
    },
    {
        name: "Giant Mountain Bike",
        model: "2023",
        type: "bicycle",
        rentPerHour: 10,
        capacity: 1,
        imageUrl: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500",
        isAvailable: true
    }
];

mongoose.connect('mongodb://localhost:27017/vehicle-rent', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing vehicles
        await Vehicle.deleteMany({});
        console.log('Cleared existing vehicles');

        // Insert new vehicles
        await Vehicle.insertMany(sampleVehicles);
        console.log('Sample vehicles added successfully');
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
})
.catch(err => console.error('Could not connect to MongoDB:', err));