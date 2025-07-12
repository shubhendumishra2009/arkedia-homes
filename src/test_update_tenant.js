'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');

// Main function to test updating a tenant with null room_id
async function testUpdateTenant() {
  try {
    // Login to get token
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testadmin@example.com',  // Our new test admin user
      password: 'admin123'             // Password we set for the test admin
    }).catch(error => {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    });
    
    console.log('Login response:', loginResponse.data);
    
    const token = loginResponse.data.token;
    console.log('Login successful, token obtained');
    
    // Update tenant with null room_id
    console.log('Updating tenant...');
    const updateResponse = await axios.put(
      'http://localhost:5000/api/tenants/1',  // Replace with a valid tenant ID
      { room_id: null },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    ).catch(error => {
      console.error('Update error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    });
    
    console.log('Update response:', updateResponse.data);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUpdateTenant();