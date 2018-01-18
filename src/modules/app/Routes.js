export class Routes {
  reigsterPages (pages) {

  }

  getLittleRouterConfig () {
    return {
      '/': {},
      '/:location/:language(/*)': {},
      '/:location/:language/search': {},
      '/:location/:language/disclaimer': {},
      '/:location/:language/events(/:id)': {},
      '/:location/:language/fetch-pdf': {},
      '/:unknown(/)': {},
      '/:language(/)': {},
      '/disclaimer': {}
    }
  }

  getRoute (page, params = {}) {

  }
}

export default Routes
