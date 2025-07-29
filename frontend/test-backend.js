const axios = require('axios');

const testBackend = async () => {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('Testing backend connectivity...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test registration endpoint
    const testUser = {
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      password: 'testpassword123'
    };
    
    console.log('Testing registration endpoint...');
    const registerResponse = await axios.post(`${baseURL}/auth/register`, testUser);
    console.log('✅ Registration test passed:', registerResponse.data);
    
  } catch (error) {
    console.error('❌ Backend test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Network error - no response received');
      console.error('Make sure the backend server is running on port 3000');
    } else {
      console.error('Error:', error.message);
    }
  }
};

testBackend(); 