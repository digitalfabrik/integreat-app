class Navigation {
  constructor (location, language) {
    this._location = location
    this._language = language
  }

  get home () {
    return `/${this._language}/${this._location}`
  }

  get locationSelection () {
    return `/${this._language}`
  }

  get search () {
    return `/${this._language}/${this._location}/search`
  }

  get disclaimer () {
    return `/${this._language}/${this._location}/disclaimer`
  }
}

export default Navigation
