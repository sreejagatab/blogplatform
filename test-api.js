// Simple test script to verify the demo login API
const testDemoLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/demo/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@blogplatform.com'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testDemoLogin();
