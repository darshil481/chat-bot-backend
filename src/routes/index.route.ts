import { Router } from 'express';
import ChatHistoryRoute from './chatHistory.route';

export interface Routes {
  path?: string;
  router: Router;
}

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();

  private routes: Routes[] = [
    new ChatHistoryRoute()
  ];

  constructor() {
    this.initializeRoutes();
  }

   private initializeRoutes() {
    this.routes.forEach(route => {
      this.router.use('/', route.router);
    });
  }
}

export default IndexRoute;
