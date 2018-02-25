import EventModel from '../EventModel'

describe('EventModel', () => {
  it('should have correct address if we have address and town', () => {
    const event = new EventModel({address: 'Wertachstraße 29', town: 'Augsburg'})
    expect(event.address).toBe('Wertachstraße 29, Augsburg')
  })

  it('should have correct address if we have only address', () => {
    const event = new EventModel({address: 'Wertachstraße 29'})
    expect(event.address).toBe('Wertachstraße 29')
  })

  it('should have correct address if we have only town', () => {
    const event = new EventModel({town: 'Augsburg'})
    expect(event.address).toBe('Augsburg')
  })

  it('should have no address if we have neither address nor town', () => {
    const event = new EventModel({})
    expect(event.address).toBeNull()
  })
})
