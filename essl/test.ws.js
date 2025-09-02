// Node.js WebSocket test client
import WebSocket from 'ws';

const testWebSocket = () => {
  const ws = new WebSocket('wss://essl.globaltechnicalinstitute.com/device', {
    headers: {
      'x-device-id': 'test-device-001',
      'authorization': 'Bearer YOUR_SECRET_TOKEN'
    }
  });

  ws.on('open', () => {
    console.log('✅ Connected to WebSocket server');
    
    // Test sending a message
    ws.send(JSON.stringify({
      action: 'test',
      message: 'Hello from client'
    }));
  });

  ws.on('message', (data) => {
    console.log('📨 Received:', JSON.parse(data.toString()));
  });

  ws.on('close', (code, reason) => {
    console.log(`❌ Connection closed: ${code} - ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
  });

  // Close connection after 10 seconds for testing
  setTimeout(() => {
    ws.close();
  }, 10000);
};

testWebSocket();