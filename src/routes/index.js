export default {
  '/': {
    title: 'Landing',
    '/:location/:language': {
      '/': {
        title: 'Location page'
      },
      '/(*)': {
        title: 'Location page'
      },
      '/search': {
        title: 'Search page'
      },
      '/disclaimer': {
        title: 'Disclaimer page'
      }
    },
    '/:language': {
      title: 'Landing'
    }
  },
  '/disclaimer': {
    title: 'Static disclaimer'
  }
}
