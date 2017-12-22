import EndpointBuilder from '../../EndpointBuilder'

export default new EndpointBuilder('endpoint1')
  .withUrl('https://someurl')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
