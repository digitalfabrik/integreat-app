import ContactModel from '../../models/ContactModel'

const name = 'Maria Musterfrau'
const areaOfResponsibility = 'Bürgeramt'
const email = 'maria@musterfrau.de'
const phoneNumber = '030 1234567'
const website = 'https://maria-musterfrau.de'

class ContactModelBuilder {
  everything(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website,
    })
  }

  noWebsite(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website: null,
    })
  }

  noPhoneNumber(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber: null,
      website,
    })
  }

  noEmail(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email: null,
      phoneNumber,
      website,
    })
  }
}

export default ContactModelBuilder
