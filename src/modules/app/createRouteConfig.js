import Route from './Route'

const createRouteConfig = () => [
  new Route({
    path: '/'
  }),
  new Route({
    id: 'landing',
    path: '/:language(/)'
  }),
  new Route({
    id: 'search',
    path: '/:location/:language/search'
  }),
  new Route({
    id: 'disclaimer',
    path: '/:location/:language/disclaimer'
  }),
  new Route({
    id: 'events',
    path: '/:location/:language/events(/:id)'
  }),
  new Route({
    id: 'pdf-fetcher',
    path: '/:location/:language/fetch-pdf'
  }),
  new Route({
    id: 'extras',
    path: '/:location/:language/extras(/:extra)'
  }),
  new Route({
    id: 'categories',
    path: '/:location/:language(/*)'
  }),
  new Route({
    id: 'main-disclaimer',
    path: '/disclaimer'
  })
]

export default createRouteConfig
