import 'dotenv/config';
import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

const PORT = process.env.PORT ?? 8000;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    console.log('Connected to Data Base', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  const addressInfo = server.address();
  if (addressInfo === null) {
    server.emit('error', new Error('Invalid network address'));
    return;
  }

  let bind: string;
  if (typeof addressInfo === 'string') {
    bind = 'pipe ' + addressInfo;
  } else {
    bind =
      addressInfo.address === '::'
        ? `http://localhost:${addressInfo?.port}`
        : `port ${addressInfo?.port}`;
  }

  console.log(`Listening on${bind}`);
});

server.on('error', (error) => {
  console.log(`Error ${error.message}`);
});
