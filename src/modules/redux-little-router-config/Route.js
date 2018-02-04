import UrlPattern from 'url-pattern'

class Route {
  id
  path
  pattern

  constructor (id, path) {
    this.id = id
    this.path = path

    this.pattern = new UrlPattern(path)
  }

  stringify (params = {}) {
    return this.pattern.stringify(params)
  }

  hasPath (path) {
    return this.path === path
  }
}

export default Route
