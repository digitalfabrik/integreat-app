import { groupBy, sortBy } from 'lodash/collection'
import { isEmpty } from 'lodash/lang'
import { createActions } from 'redux-actions'

export const {requestData, receiveData} = createActions({
  REQUEST_DATA: (source) => ({isFetching: true}),
  RECEIVE_DATA: (json) => {
    let locations = json.map((location) => ({name: location.name, path: location.path}))
    locations = sortBy(locations, ['name'])
    locations = groupBy(locations, location => isEmpty(location.name) ? '?' : location.name[0].toUpperCase())
    return {isFetching: false, data: locations}
  }
})

export function fetchDataIfNeeded () {
  return function (dispatch, getState) {
    let state = getState()
    if (state.restData.isFetching) {
      return
    }
    dispatch(requestData())
    return fetch('https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
      .then(response => response.json())
      .then(json => dispatch(receiveData(json)))
      .catch((ex) => {
        throw ex
      })
  }
}
