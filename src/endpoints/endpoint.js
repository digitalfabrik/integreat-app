import { createAction } from 'redux-actions'
import Payload from 'payload'
import format from 'string-template'

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

  fetchEndpointAction (urlOptions = {}, jsonTransformOptions = {}) {
    let that = this
    return function (dispatch, getState) {
      if (getState()[that.name].isFetching) {
        return
      }

      dispatch(that.requestAction())

      let formattedURL = format(that.url, urlOptions)

      /*
       todo:  check if there are any paramters left in the url: formattedURL.match(/{(.*)?}/)
              currently this does not work as unused paramaters are just removed from the url
       */
      return fetch(formattedURL)
        .then(response => response.json())
        .then(json => dispatch(that.receiveAction(json, jsonTransformOptions, undefined)))
        .catch(ex => {
          console.error('Failed to load the endpoint request: ' + that.name)
          console.error(ex.message)
          return dispatch(that.receiveAction(that.defaultValue, jsonTransformOptions, 'errors:page.loadingFailed'))
        })
    }
  }
}
