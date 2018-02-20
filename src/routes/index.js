export default {
  '/': {
    '/:location/:language': {
      title: 'Categories page',
      '/*': {
        title: 'Categories page'
      },
      '/search': {
        title: 'Search page'
      },
      '/disclaimer': {
        title: 'Disclaimer page'
      },
      '/events(/:id)': {
        title: 'Events page'
      },
      '/fetch-pdf': {
        title: 'FetchPdf page'
      },
      '/extras/sprungbrett': {
        title: 'Sprungbrett page'
      },
      '/extras': {
        title: 'Extras page'
      }
    },
    '/(:language(/))': {
      title: 'Landing page'
    },
    '/disclaimer': {
      title: 'Static disclaimer'
    }
  }
}
