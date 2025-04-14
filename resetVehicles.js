const mongoose = require('mongoose');
const path = require('path');

// Define the Vehicle Schema since we're not in the main server context
const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  rentPerHour: { type: Number, required: true },
  capacity: { type: Number, required: true },
  fuelType: String,
  imageUrl: String,
  isAvailable: { type: Boolean, default: true }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vehicle-rent', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  resetVehicles();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

async function resetVehicles() {
  try {
    // Update all vehicles to be available
    const result = await Vehicle.updateMany(
      {}, 
      { $set: { isAvailable: true } }
    );
    
    console.log('Reset complete!');
    console.log(`Updated ${result.modifiedCount} vehicles`);
    
    // Fetch and display all vehicles
    const vehicles = await Vehicle.find({});
    console.log('\nCurrent vehicles:');
    vehicles.forEach(v => {
      console.log(`${v.name} (${v.model}): Available = ${v.isAvailable}`);
    });
  } catch (error) {
    console.error('Error resetting vehicles:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
} 