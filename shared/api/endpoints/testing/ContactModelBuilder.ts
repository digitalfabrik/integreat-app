import ContactModel from '../../models/ContactModel'

const name = 'Maria Musterfrau'
const areaOfResponsibility = 'Bürgeramt'
const email = 'maria@musterfrau.de'
const phoneNumber = '030 1234567'
const website = 'https://maria-musterfrau.de'
const mobileNumber = '0170 1234567'

class ContactModelBuilder {
  everything(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website,
      mobileNumber,
    })
  }

  noWebsite(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website: null,
      mobileNumber,
    })
  }

  noPhoneNumber(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber: null,
      website,
      mobileNumber,
    })
  }

  noEmail(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email: null,
      phoneNumber,
      website,
      mobileNumber,
    })
  }

  noMobileNumber(): ContactModel {
    return new ContactModel({
      name,
      areaOfResponsibility,
      email,
      phoneNumber,
      website,
      mobileNumber: null,
    })
  }
}

export default ContactModelBuilder
