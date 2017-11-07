export default {
  '/': {
    title: 'Landing',
    '/:location/:language': {
      '/': {
        title: 'Location page'
      },
      '/*': {
        title: 'Location page'
      },
      '/search': {
        title: 'Search page'
      },
      '/disclaimer': {
        title: 'Disclaimer page'
      },
      '/redirect': {
        title: 'Redirect page'
      },
      '/events': {
        title: 'Events page'
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
