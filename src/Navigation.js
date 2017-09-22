// todo add logic for correct hrefs here
class Navigation {
  constructor (location, language) {
    this._location = location
    this._language = language
  }

  get home () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}`
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
    return `/${this._location}/${this._language}/search`
  }

  get disclaimer () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}/disclaimer`
  }

  get events () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}/events`
  }
}

export default Navigation
