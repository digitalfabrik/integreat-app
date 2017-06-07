export default class Navigation {
  constructor (home, location, language) {
    this._home = home
    this._location = location
    this._language = language
  }

  get home () {
    return this._home
  }

  get location () {
    return this._location
  }

  get language () {
    return this._language
  }
}
