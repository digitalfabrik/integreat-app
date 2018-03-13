class DisclaimerModel {
  constructor ({id, title, content}) {
    this._id = id
    this._title = title
    this._content = content
  }

  get id () {
    return this._id
  }

  get title () {
    return this._title
  }

  get content () {
    return this._content
  }
}

export default DisclaimerModel
