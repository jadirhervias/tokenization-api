import dotenv from 'dotenv';
import { IncomingMessage } from 'http';

// Load secrets with fallback action (look up for .env file)
export const loadSecrets = () => {
  const defaultResult = dotenv.config();

  if (defaultResult.error) {
    console.warn(defaultResult.error.message);
    return;
  }

  console.log('Secrets loaded successfully');
}

export const getJsonBody = (request: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    request
      .on('data', (chunk) => {
        body += chunk;
      })
      .on('error', (error) => {
        reject(error);
      })
      .on('end', () => {
        resolve(JSON.parse(body))
      });
  });
};