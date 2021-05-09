class SprungbrettModel {
  _id: number
  _title: string
  _location: string
  _url: string
  _isEmployment: boolean
  _isApprenticeship: boolean

  constructor(params: {
    id: number
    title: string
    location: string
    url: string
    isEmployment: boolean
    isApprenticeship: boolean
  }) {
    this._id = params.id
    this._title = params.title
    this._location = params.location
    this._url = params.url
    this._isEmployment = params.isEmployment
    this._isApprenticeship = params.isApprenticeship
  }

  get id(): number {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get location(): string {
    return this._location
  }

  get url(): string {
    return this._url
  }

  get isEmployment(): boolean {
    return this._isEmployment
  }

  get isApprenticeship(): boolean {
    return this._isApprenticeship
  }
}

export default SprungbrettModel