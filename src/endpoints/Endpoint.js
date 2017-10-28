import { createAction } from 'redux-actions'
import format from 'string-template'

import Payload from 'endpoints/Payload'

class ActionType {
  static FINISH_FETCH = 'FINISH_FETCH_DATA'
  static START_FETCH = 'START_FETCH_DATA'
}

class Endpoint {
  /**
   * @type string
   */
  name
  /**
   * @type string
   */
  url
  finishFetchAction
  startFetchAction
  /**
   * @type mapStateToOptionsCallback
   */
  mapStateToOptions
  /**
   * @type shouldRefetchCallback
   */
  shouldRefetch

  /**
   * Converts a json document to an object
   */
  mapData

  /**
   * @callback mapStateToOptionsCallback
   * @param {object} state
   * @return {object} The url params
   */

  /**
   * @callback shouldRefetchCallback
   * @param {object} currentProps
   * @param {object} nextProps
   * @return {boolean} Whether we should refetch
   */

  /**
   * @param {string} name The name of this endpoint. This is used as key in the state and as Payload name. The Payload name is name + 'Paylaod'
   * @param {string} url The url with params (params are used like this: https://cms.integreat-app.de/{location}/{language})
   * @param {function} mapData Transforms the json input to a result
   * @param {mapStateToOptionsCallback} mapStateToOptions Maps the state to the url params which are needed in the Fetcher component
   * @param shouldRefetch Takes the current and the next props and should return whether we should refetch
   */
  constructor (name, url, mapData, mapStateToOptions, shouldRefetch) {
    this.name = name
    this.url = url
    this.mapStateToOptions = mapStateToOptions
    this.shouldRefetch = shouldRefetch
    this.mapData = mapData

    const actionName = this.name.toUpperCase()

    this.finishFetchAction = createAction(`${ActionType.FINISH_FETCH}_${actionName}`, (value, error, requestUrl) => {
      return new Payload(false, value, error, requestUrl)
    })
    this.startFetchAction = createAction(`${ActionType.START_FETCH}_${actionName}`, () => new Payload(true))
    this._stateName = name
  }

  /**
   * @returns {string|*} The name of the linked state
   */
  get stateName () {
    return this._stateName
  }

  /**
   * @returns {string|*} The name of the resulting payload
   */
  get payloadName () {
    return `${this.stateName}Payload`
  }

  requestAction (urlParams = {}, options = {}) {
    return (dispatch, getState) => {
      if (getState()[this.name].isFetching) {
        return
      }

      const formattedURL = format(this.url, urlParams)
      /*
       todo:  check if there are any paramters left in the url: formattedURL.match(/{(.*)?}/)
       currently this does not work as unused paramaters are just removed from the url
       */

      const lastUrl = getState()[this.name].requestUrl

      if (lastUrl && lastUrl === formattedURL) {
        // fixme: Use "cached"
        return
      }

      // Refetch if url changes or we don't have a lastUrl
      dispatch(this.startFetchAction())

      return fetch(formattedURL)
        .then(response => response.json())
        .then(json => {
          let error
          let value
          try {
            value = this.mapData(json, options)
          } catch (e) {
            error = e.message
            console.error('Failed to parse the json: ' + this.name, e.message)
          }

          return dispatch(this.finishFetchAction(value, error, formattedURL))
        })
        .catch(e => {
          console.error('Failed to load the endpoint request: ' + this.name, e.message)
          return dispatch(this.finishFetchAction(null, 'errors:page.loadingFailed', formattedURL))
        })
    }
  }
}

export default Endpoint
