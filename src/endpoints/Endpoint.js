import { createAction } from 'redux-actions'
import Payload from 'endpoints/Payload'
import format from 'string-template'
import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { connect } from 'react-redux'

import Error from 'components/Error'

import style from './Fetcher.css'

class ActionType {
  static RECEIVE = 'RECEIVE_DATA'
  static REQUEST = 'REQUEST_DATA_'
  static INVALIDATE = 'INVALIDATE_DATA_'
}

const DUMMY = () => { return {} }

export default class Endpoint {
  name
  url
  defaultJsonValue
  receiveAction
  requestAction
  invalidateAction
  mapPropsToUrlOptions
  mapPropsToTransformOptions
  mapStateToProps
  shouldUpdate

  /**
   * @param stateName The name of this endpoint. This is used as key in the state and as Payload name.
   * The Payload name is name + 'Paylaod'
   * @param url The url with params (params are used like this: https://cms.integreat-app.de/{location}/{language})
   * @param jsonToAny Transforms the json input to a result
   * @param defaultJsonValue Used as input for jsonToAny if the fetch fails
   */
  constructor (stateName, url,
               jsonToAny, defaultJsonValue = {},
               mapStateToProps = DUMMY, mapPropsToUrlOptions = DUMMY, mapPropsToTransformOptions = DUMMY, shouldUpdate = () => false) {
    this.name = stateName
    this.url = url
    this.defaultJsonValue = defaultJsonValue
    this.mapPropsToUrlOptions = mapPropsToUrlOptions
    this.mapPropsToTransformOptions = mapPropsToTransformOptions
    this.mapStateToProps = mapStateToProps
    this.shouldUpdate = shouldUpdate

    let actionName = this.name.toUpperCase()

    this.receiveAction = createAction(`${ActionType.RECEIVE}_${actionName}`, (json, options, error) =>
      new Payload(false, jsonToAny(json, options), error))
    this.requestAction = createAction(`${ActionType.REQUEST}_${actionName}`, () => new Payload(true))
    this.invalidateAction = createAction(`${ActionType.INVALIDATE}_${actionName}`, () => new Payload(false))
    this._stateName = stateName
  }

  get stateName () {
    return this._stateName
  }

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
          return dispatch(that.receiveAction(that.defaultJsonValue, jsonTransformOptions, 'errors:page.loadingFailed'))
        })
    }
  }

  createStateToPropsMapper () {
    return function (state) {
      let props = this.mapStateToProps(state)

      props[this.payloadName] = state[this.stateName]
      return props
    }.bind(this)
  }

  withFetcher () {
    const endpoint = this

    let Fetcher = class extends React.Component {
      static propTypes = {
        hideError: PropTypes.bool,
        hideSpinner: PropTypes.bool
      }

      fetch (props) {
        this.props.dispatch(endpoint.fetchEndpointAction(
          endpoint.mapPropsToUrlOptions(props),
          endpoint.mapPropsToTransformOptions(props))
        )
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
        if (endpoint.shouldUpdate(this.props, nextProps)) {  // todo: this will need some more work to test -> an other issue as
          // this is getting too big
          this.fetch(nextProps)
        }
      }

      render () {
        let payload = this.props[endpoint.payloadName]

        if (!this.props.hideError && payload.error) {
          return <Error error={payload.error}/>
        }

        if (!this.props.hideSpinner && !payload.ready()) {
          return <Spinner className={style.loading} name='line-scale-party'/>
        } else if (payload.ready()) {
          const newProps = {
            [endpoint.stateName]: payload.data,  // The actual Payload data
            [endpoint.payloadName]: payload      // The actual Payload, called: `${stateName}Payload`
          }

          return (
            <div>
              {
                React.Children.map(this.props.children,
                  (child) => React.cloneElement(child, Object.assign({}, this.props, newProps)))
              }
            </div>
          )
        } else {
          return <div/>
        }
      }
    }

    return connect(this.createStateToPropsMapper())(Fetcher)
  }
}
