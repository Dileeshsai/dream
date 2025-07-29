const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  try {
    console.log('🧪 Testing DREAM SOCIETY API...\n');

    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data);

    // Test admin login
    console.log('\n2. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    const adminToken = loginResponse.data.token;

    // Test token info
    console.log('\n3. Testing token info...');
    const tokenInfo = await axios.get(`${BASE_URL}/auth/token-info`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Token info:', tokenInfo.data);

    // Test list users
    console.log('\n4. Testing list users...');
    const users = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Users listed:', users.data.users.length, 'users found');

    // Test impersonation
    console.log('\n5. Testing impersonation...');
    const memberUser = users.data.users.find(u => u.role === 'member');
    if (memberUser) {
      const impersonateResponse = await axios.post(`${BASE_URL}/admin/impersonate`, {
        user_id: memberUser.id
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Impersonation successful');
      
      // Test impersonated token
      const impersonatedToken = impersonateResponse.data.token;
      const impersonatedInfo = await axios.get(`${BASE_URL}/auth/token-info`, {
        headers: { Authorization: `Bearer ${impersonatedToken}` }
      });
      console.log('✅ Impersonated token info:', impersonatedInfo.data);
    }

    console.log('\n🎉 All tests passed! API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 