// @flow

type NotFoundType = 'category' | 'event' | 'extra'

const getMessage = (type: NotFoundType, id: string): string =>
  `The ${type} ${id} does not exist here.`

class ContentNotFoundError extends Error {
  _type: NotFoundType
  _id: string | number
  _city: string
  _language: string

  constructor (params: { type: NotFoundType, id: string, city: string, language: string }) {
    super(getMessage(params.type, params.id))

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentNotFoundError)
    }

    this.name = 'ContentNotFoundError'
    this._type = params.type
    this._id = params.id
    this._city = params.city
    this._language = params.language
  }

  get type (): NotFoundType {
    return this._type
  }

  get id (): string | number {
    return this._id
  }

  get city (): string {
    return this._city
  }

  get language (): string {
    return this._language
  }
}

export default ContentNotFoundError
