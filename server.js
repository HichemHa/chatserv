const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let userCount = 0;
const userIds = new Map();

wss.on('connection', ws => {
  userCount++;
  const userId = `user${userCount}`;
  userIds.set(ws, userId);

  console.log(`${userId} connected`);

  ws.on('message', message => {
    const formattedMessage = `${userId}: ${message}`;
    console.log(`Received message from ${userId} => ${message}`);
    // Broadcast the message to all clients except the sender
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(formattedMessage);
      }
    });
  });

  ws.on('close', () => {
    console.log(`${userId} disconnected`);
    userIds.delete(ws);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
