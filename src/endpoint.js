import { createActions } from 'redux-actions'

export default function fetchEndpoint (endpoint) {
  return function (dispatch, getState) {
    let state = getState()
    if (state[endpoint.name].isFetching) {
      return
    }
    dispatch(endpoint.requestData())
    return fetch(endpoint.url)
      .then(response => response.json())
      .then(json => dispatch(endpoint.receiveData(json)))
      .catch((ex) => {
        throw ex
      })
  }
}

export class Endpoint {
  constructor (name, url, transform) {
    this.name = name
    this.url = url
    this.transform = transform

    let actions = this.getActions()
    this.receiveData = actions.receiveData
    this.requestData = actions.requestData
  }

  getActions () {
    const {requestData, receiveData} = createActions({
      REQUEST_DATA: (source) => ({isFetching: true}),
      RECEIVE_DATA: (json) => ({isFetching: false, data: this.transform(json)})
    })
    return {requestData, receiveData}
  }
}
