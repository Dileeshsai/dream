const axios = require('axios');

// Test the network API endpoint
async function testNetworkAPI() {
  try {
    console.log('Testing Network API endpoint...');
    
    // First, let's test if the server is running
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('Server health check:', healthResponse.data);
    
    // Test the members endpoint (this will fail without auth, but we can see the route exists)
    try {
      const membersResponse = await axios.get('http://localhost:3000/users/members');
      console.log('Members response:', membersResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Route exists but requires authentication (expected)');
      } else {
        console.log('❌ Error testing members endpoint:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Server not running or error:', error.message);
    console.log('Please start the server with: npm start');
  }
}

testNetworkAPI(); 