class ContactModel {
  _name: string
  _areaOfResponsibility: string | null
  _email: string
  _phoneNumber: string
  _website: string

  constructor({
    name,
    areaOfResponsibility,
    email,
    phoneNumber,
    website,
  }: {
    name: string
    areaOfResponsibility: string | null
    email: string
    phoneNumber: string
    website: string
  }) {
    this._name = name
    this._areaOfResponsibility = areaOfResponsibility
    this._email = email
    this._phoneNumber = phoneNumber
    this._website = website
  }

  get name(): string {
    return this._name
  }

  get areaOfResponsibility(): string | null {
    return this._areaOfResponsibility
  }

  get email(): string {
    return this._email
  }

  get phoneNumber(): string {
    return this._phoneNumber
  }

  get website(): string {
    return this._website
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
