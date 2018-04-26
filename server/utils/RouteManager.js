/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

class RouteManager {
  constructor() {
    this.routes = [];
  }

  addRoute(method, route, controller) {
    this.routes.push({method, route, controller})
  }
}

module.exports = new RouteManager();