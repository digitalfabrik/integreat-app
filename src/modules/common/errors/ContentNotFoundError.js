// @flow

type NotFound = 'category' | 'event' | 'extra'

class ContentNotFoundError extends Error {
  _type: NotFound
  _id: string | number
  _city: string

  getMessage = (type: NotFound, id: string, city: string): string =>
    `The ${type} ${id} does not exist in ${city} in your current language.`

  constructor (params: {type: NotFound, id: string, city: string}) {
    super()
    this.message = this.getMessage(params.type, params.id, params.city)
    this._type = params.type
    this._id = params.id
    this._city = params.city
  }

  get type (): NotFound {
    return this._type
  }

  get id (): string | number {
    return this._id
  }

  get city (): string {
    return this._city
  }
}

export default ContentNotFoundError
