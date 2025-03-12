class ContactModel {
  _name: string | null
  _areaOfResponsibility: string | null
  _email: string | null
  _phoneNumber: string | null
  _website: string | null
  _mobilePhoneNumber: string | null

  constructor({
    name,
    areaOfResponsibility,
    email,
    phoneNumber,
    website,
    mobilePhoneNumber,
  }: {
    name: string | null
    areaOfResponsibility: string | null
    email: string | null
    phoneNumber: string | null
    website: string | null
    mobilePhoneNumber: string | null
  }) {
    this._name = name
    this._areaOfResponsibility = areaOfResponsibility
    this._email = email
    this._phoneNumber = phoneNumber
    this._website = website
    this._mobilePhoneNumber = mobilePhoneNumber
  }

  get name(): string | null {
    return this._name
  }

  get areaOfResponsibility(): string | null {
    return this._areaOfResponsibility
  }

  get email(): string | null {
    return this._email
  }

  get phoneNumber(): string | null {
    return this._phoneNumber
  }

  get website(): string | null {
    return this._website
  }

  get mobilePhoneNumber(): string | null {
    return this._mobilePhoneNumber
  }

  get headline(): string | null {
    if (this.name && this.areaOfResponsibility) {
      return `${this.name} | ${this.areaOfResponsibility}`
    }
    if (this.name) {
      return this.name
    }
    if (this.areaOfResponsibility) {
      return this.areaOfResponsibility
    }
    return null
  }
}

export default ContactModel
