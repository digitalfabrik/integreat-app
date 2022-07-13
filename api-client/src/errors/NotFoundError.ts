import { LocalNewsType, TuNewsType } from '../routes'

type NotFoundType =
  | 'city'
  | 'category'
  | 'event'
  | 'poi'
  | 'offer'
  | 'disclaimer'
  | TuNewsType
  | LocalNewsType
  | 'route'

const getMessage = (type: NotFoundType, id: string): string => `The ${type} ${id} does not exist here.`

class NotFoundError extends Error {
  _type: NotFoundType
  _id: string | number
  _city: string | undefined
  _language: string | undefined

  constructor(params: { id: string; type: NotFoundType; city?: string; language?: string }) {
    super(getMessage(params.type, params.id))

    // captureStackTrace is not always defined on mobile
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/263/
    // https://sentry.tuerantuer.org/organizations/digitalfabrik/issues/265/
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }

    this.name = 'NotFoundError'
    this._id = params.id
    this._type = params.type
    this._city = params.city
    this._language = params.language
  }

  get type(): NotFoundType {
    return this._type
  }

  get id(): string | number {
    return this._id
  }

  get city(): string | undefined {
    return this._city
  }

  get language(): string | undefined {
    return this._language
  }
}

export default NotFoundError
