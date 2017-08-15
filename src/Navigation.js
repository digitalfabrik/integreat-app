class Navigation {
  constructor (location) {
    this._location = location
  }

  get home () {
    if (this._location) {
      return '/location/' + this._location
    }
    return this.locationSelection
  }

  get locationSelection () {
    return '/'
  }

  get search () {
    return '/location/' + this._location + '/search'
  }

  get disclaimer () {
    if (!this._location) {
      return null
    }
    return '/location/' + this._location + '/disclaimer'
  }
}

export default Navigation
