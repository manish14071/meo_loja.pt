import fetch from 'node-fetch';

const BASE_URL = 'https://meo-loja-pt.onrender.com';

async function testEndpoints() {
  try {
    // Test root endpoint
    const root = await fetch(BASE_URL);
    console.log('Root:', await root.json());

    // Test health endpoint
    const health = await fetch(`${BASE_URL}/health`);
    console.log('Health:', await health.json());

    // Test API docs
    const docs = await fetch(`${BASE_URL}/api-docs`);
    console.log('API Docs:', await docs.json());

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEndpoints();