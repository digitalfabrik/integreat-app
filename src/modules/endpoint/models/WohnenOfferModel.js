// @flow

import type Moment from 'moment'

class WohnenOfferModel<F> {
  _email: string
  _createdDate: Moment
  _formDataType: Class<F>
  _formData: F

  constructor (params: {
    email: string,
    createdDate: Moment,
    formDataType: Class<F>,
    formData: F
  }) {
    this._email = params.email
    this._createdDate = params.createdDate
    this._formData = params.formData
    this._formDataType = params.formDataType
  }

  get email (): string {
    return this._email
  }

  get createdDate (): Moment {
    return this._createdDate
  }

  get formDataType (): Class<F> {
    return this._formDataType
  }

  get formData (): F {
    return this._formData
  }
}

export default WohnenOfferModel
