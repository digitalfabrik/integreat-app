import Endpoint from './endpoint'

export default new Endpoint(
  'events',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  json => {
    return json
  }
)
