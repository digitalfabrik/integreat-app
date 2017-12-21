import StateMapperBuilder from '../StateMapperBuilder'
import EndpointBuilder from '../EndpointBuilder'

describe('StateMapperBuilder', () => {
  const endpointBuilder = new EndpointBuilder('endpoint')

  test('should build without any specification', () => {
    const mapper = new StateMapperBuilder(endpointBuilder).build()
    expect(mapper()).toEqual({})
  })

  test('should be definable by fromFunction', () => {
    const someMapper = () => ({something: 'a'})
    const builder = new StateMapperBuilder(endpointBuilder)
    builder.fromFunction(someMapper)
    const mapper = builder.build()
    expect(mapper).toBe(someMapper)
  })

  test('should throw error if no mapper is specified', () => {
    expect(() => new StateMapperBuilder(endpointBuilder).fromFunction(null).build()).toThrow()
  })

  test('should be definable by fromArray', () => {
    const builder = new StateMapperBuilder(endpointBuilder)
    builder.fromArray(['a', 'b', 'c'])
    const mapper = builder.build()
    const state = {a: 'a', b: 'b', c: 'c', d: 'd'}
    expect(mapper(state)).toEqual({a: 'a', b: 'b', c: 'c'})
  })

  test('should be definable by fromArray with custom stateSelector', () => {
    const builder = new StateMapperBuilder(endpointBuilder)
    builder.fromArray(['a', 'b', 'c'], (state, element) => state.custom[element])
    const mapper = builder.build()
    const state = {custom: {a: 'a', b: 'b', c: 'c'}, d: 'd'}
    expect(mapper(state)).toEqual({a: 'a', b: 'b', c: 'c'})
  })
})
