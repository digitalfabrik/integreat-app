import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createAction } from 'redux-actions'
import Spinner from 'react-spinkit'

import format from 'string-template'
import cx from 'classnames'

import Error from 'components/Error'

import Payload from 'endpoints/Payload'

import style from './Fetcher.css'

class ActionType {
  static RECEIVE = 'RECEIVE_DATA'
  static REQUEST = 'REQUEST_DATA_'
  static INVALIDATE = 'INVALIDATE_DATA_'
}

const DUMMY = () => { return {} }

export default class Endpoint {
  /**
   * @type string
   */
  name
  /**
   * @type string
   */
  url
  receiveAction
  requestAction
  invalidateAction
  /**
   * @type propsToOptionsCallback
   */
  mapPropsToUrlOptions
  /**
   * @type propsToOptionsCallback
   */
  mapPropsToTransformOptions
  /**
   * @type stateToPropsCallback
   */
  mapStateToProps
  /**
   * @type shouldRefetchCallback
   */
  shouldRefetch

  /**
   * @callback stateToPropsCallback
   * @param {object} state
   * @return {object} The params
   */

  /**
   * @callback propsToOptionsCallback
   * @param {object} params
   * @return {object} The options
   */

  /**
   * @callback shouldRefetchCallback
   * @param {object} currentProps
   * @param {object} nextProps
   * @return {boolean} Whether we should refetch
   */

  /**
   * @param {string} stateName The name of this endpoint. This is used as key in the state and as Payload name. The Payload name is name + 'Paylaod'
   * @param {string} url The url with params (params are used like this: https://cms.integreat-app.de/{location}/{language})
   * @param {string} jsonToAny Transforms the json input to a result
   * @param {stateToPropsCallback} mapStateToProps Maps the state to the props which are needed in the Fetcher component ({@link mapPropsToUrlOptions} and {@link mapPropsToTransformOptions})
   * @param {propsToOptionsCallback} mapPropsToUrlOptions Maps the properties of the Fetcher component to the url options needed in {@link url}
   * @param {propsToOptionsCallback} mapPropsToTransformOptions Maps the properties of the Fetcher component to the transform options needed by {@link jsonToAny}
   * @param shouldRefetch Takes the current and the next props and should return whether we should refetch
   */
  constructor (stateName, url,
               jsonToAny,
               mapStateToProps = DUMMY, mapPropsToUrlOptions = DUMMY, mapPropsToTransformOptions = DUMMY, shouldRefetch = () => false) {
    this.name = stateName
    this.url = url
    this.mapPropsToUrlOptions = mapPropsToUrlOptions
    this.mapPropsToTransformOptions = mapPropsToTransformOptions
    this.mapStateToProps = mapStateToProps
    this.shouldRefetch = shouldRefetch

    let actionName = this.name.toUpperCase()

    this.receiveAction = createAction(`${ActionType.RECEIVE}_${actionName}`, (json, options, error) =>
      new Payload(false, jsonToAny(json, options), error))
    this.requestAction = createAction(`${ActionType.REQUEST}_${actionName}`, () => new Payload(true))
    this.invalidateAction = createAction(`${ActionType.INVALIDATE}_${actionName}`, () => new Payload(false))
    this._stateName = stateName
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
          console.error('Failed to load the endpoint request: ' + that.name, ex.message)
          return dispatch(that.receiveAction(null, jsonTransformOptions, 'errors:page.loadingFailed'))
        })
    }
  }

  createStateToPropsMapper () {
    return function (state) {
      let props = this.mapStateToProps(state)

      if (!props) {
        throw new Error('mapStateToProps(state) returned nothing')
      }

      props[this.payloadName] = state[this.stateName]
      return props
    }.bind(this)
  }

  withFetcher () {
    const endpoint = this

    let Fetcher = class extends React.Component {
      static propTypes = {
        hideError: PropTypes.bool,
        hideSpinner: PropTypes.bool,
        className: PropTypes.string
      }

      fetch (props) {
        const url = endpoint.mapPropsToUrlOptions(props)
        if (!url) {
          throw new Error('mapPropsToUrlOptions(props) returned nothing')
        }

        const transform = endpoint.mapPropsToTransformOptions(props)
        if (!transform) {
          throw new Error('mapPropsToTransformOptions(props) returned nothing')
        }

        this.props.dispatch(endpoint.fetchEndpointAction(url, transform))
      }

      invalidate () {
        this.props.dispatch(endpoint.invalidateAction())
      }

      componentWillUnmount () {
        this.invalidate()
      }

      componentWillMount () {
        this.fetch(this.props)
      }

      componentWillUpdate (nextProps) {
        if (endpoint.shouldRefetch(this.props, nextProps)) {   // todo:  this will need some more work to test -> an other issue as
          //        this is getting too big
          this.fetch(nextProps)
        }
      }

      render () {
        let payload = this.props[endpoint.payloadName]

        if (!this.props.hideError && payload.error) {
          return <Error className={cx(style.loading, this.props.className)} error={payload.error}/>
        }

        if (!this.props.hideSpinner && !payload.ready()) {
          return <Spinner className={cx(style.loading, this.props.className)} name='line-scale-party'/>
        } else if (payload.ready()) {
          const newProps = {
            [endpoint.stateName]: payload.data,  // The actual Payload data
            [endpoint.payloadName]: payload      // The actual Payload, called: `${stateName}Payload`
          }

          return (
            <div className={this.props.className}>
              {
                React.Children.map(this.props.children,
                  (child) => React.cloneElement(child, Object.assign({}, this.props, newProps)))
              }
            </div>
          )
        } else {
          return <div className={this.props.className}/>
        }
      }
    }

    return connect(this.createStateToPropsMapper())(Fetcher)
  }
}
