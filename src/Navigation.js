class Navigation {
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

export default Navigation

/**
 * This object holds the configured paths for navigation. This can be used e.g. in the Header
 * @type {Navigation}
 */
export const DEFAULT_NAVIGATION = new Navigation('/', '/', '/')
