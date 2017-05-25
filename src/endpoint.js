import { createAction } from 'redux-actions'

export default function fetchEndpoint (endpoint, formatURL = url => url) {
  return function (dispatch, getState) {
    if (getState()[endpoint.name].isFetching) {
      return
    }

    dispatch(endpoint.requestAction())

    return fetch(formatURL(endpoint.url))
      .then(response => response.json())
      .then(json => dispatch(endpoint.receiveAction(json)))
      .catch((ex) => {
        throw ex
      })
  }
}

export class Endpoint {
  constructor (name, url, transform) {
    this.name = name
    this.url = url

    let actionName = this.name.toUpperCase()

    this.receiveAction = createAction('RECEIVE_DATA_' + actionName, json => ({
      isFetching: false,
      data: transform(json)
    }))
    this.requestAction = createAction('REQUEST_DATA_' + actionName, () => ({isFetching: true}))
    this.invalidateAction = createAction('INVALIDATE_DATA_' + actionName, () => ({isFetching: false, data: null}))
  }
}
