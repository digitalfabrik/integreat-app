import EndpointBuilder from '../../EndpointBuilder'

export default EndpointBuilder('endpoint')
  .withUrl('https://someurl')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
