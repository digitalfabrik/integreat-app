import ContactModel from '../ContactModel'

describe('ContactModel', () => {
  const contactWithAllInformation = new ContactModel({
    name: 'Max Mustermann',
    areaOfResponsibility: 'Welcoming',
    email: 'test@tuerantuer.org',
    phoneNumber: '123456789',
    website: 'https://tuerantuer.org',
    mobileNumber: '01701234567',
  })

  const contactWithoutAreaOfResponsibility = new ContactModel({
    name: 'Max Mustermann',
    areaOfResponsibility: null,
    email: 'test@tuerantuer.org',
    phoneNumber: '123456789',
    website: 'https://tuerantuer.org',
    mobileNumber: '01701234567',
  })

  const contactWithoutName = new ContactModel({
    name: '',
    areaOfResponsibility: 'Welcoming',
    email: 'test@tuerantuer.org',
    phoneNumber: '123456789',
    website: 'https://tuerantuer.org',
    mobileNumber: '01701234567',
  })

  const contactWithoutAreaOfResponsibilityAndName = new ContactModel({
    name: '',
    areaOfResponsibility: null,
    email: 'test@tuerantuer.org',
    phoneNumber: '123456789',
    website: 'https://tuerantuer.org',
    mobileNumber: '01701234567',
  })

  it('should return the correct headline', () => {
    expect(contactWithAllInformation.headline).toBe('Max Mustermann | Welcoming')
    expect(contactWithoutAreaOfResponsibility.headline).toBe('Max Mustermann')
    expect(contactWithoutName.headline).toBe('Welcoming')
    expect(contactWithoutAreaOfResponsibilityAndName.headline).toBeNull()
  })
})
