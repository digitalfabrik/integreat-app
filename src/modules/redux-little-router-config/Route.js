import UrlPattern from 'url-pattern'

class Route {
  id
  path
  pattern
  renderComponent
  condition

  constructor (id, path, renderComponent, condition) {
    this.id = id
    this.path = path
    this.renderComponent = renderComponent
    this.condition = condition

    this.pattern = new UrlPattern(path)
  }

  stringify (params = {}) {
    return this.pattern.stringify(params)
  }
}

export default Route
