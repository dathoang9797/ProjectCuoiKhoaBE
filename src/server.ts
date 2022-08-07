import '@Configs/DB_Connect';

import http from 'http';
import app from './app';

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server running on: ' + port);
});

process.on('unhandledRejection', (err) => {
  const error = err as Error;
  console.log(error.name, error.message);
  console.log('UNHANDLED REJECTION! 🎇 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  const error = err as Error;
  console.log(error.name, error.message);
  console.log('UNHANDLED EXCEPTION! 🎇 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
