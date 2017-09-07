export default {
  '/': {
    title: 'Landing',
    '/:language': {
      title: 'Landing',
      '/': {
        title: 'Landing'
      },
      '/:location': {
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
      }
    }
  }
}
