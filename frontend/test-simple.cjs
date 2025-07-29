const http = require('http');

const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`Body: ${chunk}`);
    });
    
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    console.log('Backend server is not running. Please start the backend first.');
  });

  req.end();
};

console.log('Testing backend connectivity...');
testBackend(); 