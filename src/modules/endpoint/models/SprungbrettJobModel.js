class SprungbrettModel {
  constructor ({id, title, location, url, isEmployment, isApprenticeship}) {
    this._id = id
    this._title = title
    this._location = location
    this._url = url
    this._isEmployment = isEmployment
    this._isApprenticeship = isApprenticeship
  }

  get id () {
    return this._id
  }

  get title () {
    return this._title
  }

  get location () {
    return this._location
  }

  get url () {
    return this._url
  }

  get isEmployment () {
    return this._isEmployment
  }

  get isApprenticeship () {
    return this._isApprenticeship
  }
}

export default SprungbrettModel
