export default {
  '/': {
    title: 'Landing',
    '/:language': {
      title: 'Landing',
      '/:location': {
        '/(*)': {
          title: 'Search page'
        },
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
  }
}
