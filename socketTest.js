const io = require('socket.io-client');

const socket = io('http://localhost:4000'); 

socket.on('connect', () => {
  console.log('Connected to server');
  
  const sessionId = 'session2'; 
  socket.emit('chat:join', sessionId);
  
  const query = 'postponed meeting between India and Pakistans DGMOs';
  socket.emit('chat:message', { sessionId, query });

  socket.emit('chat:history', sessionId);
  socket.emit('chat:end', sessionId,"abc");
});

socket.on('chat:message', (data) => {
  console.log('Received message:', data.message); 
});

socket.on('chat:history', (data) => {
  console.log('Search History:', data.history); 
});

socket.on('chat:cleared', () => {
  console.log('Session history cleared.');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
