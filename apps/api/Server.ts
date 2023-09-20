import http from 'http';
import { initRouter } from './router';

export class Server {
  readonly port: string;
  httpServer?: http.Server;

  constructor(port: string) {
    this.port = port;
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
        res.setHeader('Content-type', 'application/json');
        await initRouter(req, res);
      });

      this.httpServer.listen(this.port, () => {
        console.log(`API is running at http://localhost:${this.port} in ${process.env.NODE_ENV} mode`);
        console.log('Press CTRL-C to stop\n');
        resolve();
      });
    });
  }

  getHTTPServer() {
    return this.httpServer;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      }

      return resolve();
    });
  }
}