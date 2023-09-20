import { loadSecrets } from './utils';
import { TokenizationApp } from '../TokenizationApp';

try {
  loadSecrets();
  new TokenizationApp().start().catch(handleError);
} catch (error) {
  handleError(error);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await TokenizationApp.closeDatabaseConnection();
  await TokenizationApp.closeRedisConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await TokenizationApp.closeDatabaseConnection();
  await TokenizationApp.closeRedisConnection();
  process.exit(0);
});

function handleError(error: any) {
  console.log(error);
  process.exit(1);
}