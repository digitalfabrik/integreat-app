import { createAction } from 'redux-actions'
import Payload from 'payload'

export function fetchEndpoint (endpoint, formatURL = (url => url), jsonTransformOptions = {}) {
  return function (dispatch, getState) {
    if (getState()[endpoint.name].isFetching) {
      return
    }

    dispatch(endpoint.requestAction())

    return fetch(formatURL(endpoint.url))
      .then(response => response.json())
      .then(json => dispatch(endpoint.receiveAction(json, jsonTransformOptions, undefined)))
      .catch(ex => {
        console.err('Failed to load the endpoint request: ' + endpoint.name)
        console.err(ex.message)
        return dispatch(endpoint.receiveAction(endpoint.defaultValue, jsonTransformOptions, 'errors:page.loadingFailed'))
      })
  }
}

export default class Endpoint {
  constructor (name, url, transform, defaultValue = {}) {
    this.name = name
    this.url = url
    this.defaultValue = defaultValue

    let actionName = this.name.toUpperCase()

    this.receiveAction = createAction('RECEIVE_DATA_' + actionName, (json, options, error) =>
      new Payload(false, transform(json, options), error))
    this.requestAction = createAction('REQUEST_DATA_' + actionName, () => new Payload(true))
    this.invalidateAction = createAction('INVALIDATE_DATA_' + actionName, () => new Payload(false))
  }
}
