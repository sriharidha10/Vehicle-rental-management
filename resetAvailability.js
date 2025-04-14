const axios = require('axios');

console.log('Attempting to reset vehicle availability...');

axios.post('http://localhost:5000/api/vehicles/reset-availability')
  .then(response => {
    console.log('Success!');
    console.log('Message:', response.data.message);
    console.log('Number of vehicles updated:', response.data.updatedCount);
  })
  .catch(error => {
    console.error('Error resetting vehicle availability:', error.message);
  });