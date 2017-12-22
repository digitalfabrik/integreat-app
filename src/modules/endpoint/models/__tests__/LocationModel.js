import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  test('should have correct sort key and category', () => {
    const model = new LocationModel({name: 'blah'})
    expect(model.sortKey).toBe('blah')
    expect(model.sortCategory).toBe('B')
  })

  test('should ignore some prefixes for sort key', () => {
    const model = new LocationModel({name: 'Kreis Blah'})
    expect(model.sortKey).toBe('blah')
    expect(model.sortCategory).toBe('B')
  })

  test('should have unknown category if name is empty', () => {
    const model = new LocationModel({name: ''})
    expect(model.sortKey).toBe('')
    expect(model.sortCategory).toBe('?')

    const anotherModel = new LocationModel({name: 'Kreis '})
    expect(anotherModel.sortKey).toBe('')
    expect(anotherModel.sortCategory).toBe('?')
  })
})
