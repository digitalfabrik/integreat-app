class SprungbrettModel {
  constructor ({id, title, city, url, isEmployment, isApprenticeship}) {
    this._id = id
    this._title = title
    this._city = city
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

  get city () {
    return this._city
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
