import { createAction } from 'redux-actions'

export function fetchEndpoint (endpoint, formatURL = url => url, options = {}) {
  return function (dispatch, getState) {
    if (getState()[endpoint.name].isFetching) {
      return
    }

    dispatch(endpoint.requestAction())

    return fetch(formatURL(endpoint.url))
      .then(response => response.json())
      .then(json => dispatch(endpoint.receiveAction(json, options)))
      .catch((ex) => {
        throw ex
      })
  }
}

export default class Endpoint {
  constructor (name, url, transform) {
    this.name = name
    this.url = url

    let actionName = this.name.toUpperCase()

    this.receiveAction = createAction('RECEIVE_DATA_' + actionName, (json, options) => ({
      isFetching: false,
      data: transform(json, options)
    }))
    this.requestAction = createAction('REQUEST_DATA_' + actionName, () => ({isFetching: true}))
    this.invalidateAction = createAction('INVALIDATE_DATA_' + actionName, () => ({isFetching: false, data: null}))
  }
}
