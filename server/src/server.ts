import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string, {
      ssl: true,
      retryWrites: true,
    } as mongoose.ConnectOptions);

    server = app.listen(config.port, () => {
      console.log(`✅ App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(`❌ Error connecting to MongoDB:`, err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 Unhandled Rejection detected, shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 Uncaught Exception detected, shutting down...`);
  process.exit(1);
});
