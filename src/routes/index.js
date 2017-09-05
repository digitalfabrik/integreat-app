export default {
  '/': {
    title: 'Landing',
    '/landing': {
      title: 'Landing'
    }
  },
  '/:language/:location': {
    '/search': {
      title: 'Search page'
    },
    '/disclaimer': {
      title: 'Disclaimer page'
    },
    '/location(/*)': {
      title: 'Location page'
    }
  }
}
