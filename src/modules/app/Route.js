import UrlPattern from 'url-pattern'

/**
 * Holds data about an url and allows maching it
 */
class Route {
  id
  path
  pattern

  constructor ({id = null, path}) {
    this.id = id
    this.path = path

    this.pattern = new UrlPattern(path)
  }

  /**
   * Creates the path for this route with supplied params
   *
   * @see url-pattern package for more information
   * @param params The params which will be used to build the path
   */
  stringify (params = {}) {
    return this.pattern.stringify(params)
  }

  hasPath (path) {
    return this.path === path
  }
}

export default Route
