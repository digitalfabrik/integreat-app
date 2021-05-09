// @flow

import type Moment from 'moment'

class WohnenOfferModel {
  _email: string
  _createdDate: Moment
  _formData: *

  constructor(params: { email: string, createdDate: Moment, formData: * }) {
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

  get formData(): * {
    return this._formData
  }
}

export default WohnenOfferModel
