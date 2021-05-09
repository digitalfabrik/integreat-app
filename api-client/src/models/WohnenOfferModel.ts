import type Moment from 'moment'

class WohnenOfferModel {
  _email: string
  _createdDate: Moment
  _formData: any

  constructor(params: { email: string; createdDate: Moment; formData: any }) {
    this._email = params.email
    this._createdDate = params.createdDate
    this._formData = params.formData
  }

  get email(): string {
    return this._email
  }

  get createdDate(): Moment {
    return this._createdDate
  }

  get formData(): any {
    return this._formData
  }
}

export default WohnenOfferModel