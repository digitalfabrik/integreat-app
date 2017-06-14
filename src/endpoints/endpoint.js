import { createAction } from 'redux-actions'

export function fetchEndpoint (endpoint, formatURL = url => url, jsonOptions = {}) {
  return function (dispatch, getState) {
    if (getState()[endpoint.name].isFetching) {
      return
    }

    dispatch(endpoint.requestAction())

    return fetch(formatURL(endpoint.url))
      .then(response => response.json())
      .then(json => dispatch(endpoint.receiveAction(json, jsonOptions, undefined)))
      .catch(ex => {
        return dispatch(endpoint.receiveAction(endpoint.defaultValue, jsonOptions, ex.message))
      })
  }
}

export default class Endpoint {
  constructor (name, url, transform, defaultValue = {}) {
    this.name = name
    this.url = url
    this.defaultValue = defaultValue

    let actionName = this.name.toUpperCase()

    this.receiveAction = createAction('RECEIVE_DATA_' + actionName, (json, options, error) => ({
      isFetching: false,
      error: error,
      data: transform(json, options)
    }))
    this.requestAction = createAction('REQUEST_DATA_' + actionName, () => ({isFetching: true}))
    this.invalidateAction = createAction('INVALIDATE_DATA_' + actionName, () => ({isFetching: false, data: null}))
  }
}
