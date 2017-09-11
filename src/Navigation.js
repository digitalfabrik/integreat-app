class Navigation {
  constructor (location, language) {
    this._location = location
    this._language = language
  }

  get home () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._language}/${this._location}`
  }

  get locationSelection () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._language}`
  }

  get search () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._language}/${this._location}/search`
  }

  get disclaimer () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._language}/${this._location}/disclaimer`
  }
}

export default Navigation
