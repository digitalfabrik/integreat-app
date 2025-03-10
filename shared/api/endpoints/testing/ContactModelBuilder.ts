import ContactModel from '../../models/ContactModel'

const name = 'Maria Musterfrau'
const areaOfResponsibility = 'Bürgeramt'
const email = 'maria@musterfrau.de'
const phoneNumber = '030 1234567'
const website = 'https://maria-musterfrau.de'
const mobilePhoneNumber = '0170 1234567'

class ContactModelBuilder {
  everything(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website,
      mobilePhoneNumber,
    })
  }

  noWebsite(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website: null,
      mobilePhoneNumber,
    })
  }

  noPhoneNumber(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber: null,
      website,
      mobilePhoneNumber,
    })
  }

  noEmail(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email: null,
      phoneNumber,
      website,
      mobilePhoneNumber,
    })
  }

  noMobilePhoneNumber(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website,
      mobilePhoneNumber: null,
    })
  }
}

export default ContactModelBuilder
