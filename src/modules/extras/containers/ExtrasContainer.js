// @flow

import connect from 'react-redux/es/connect/connect'
import { Linking } from 'react-native'
import Extras from '../components/Extras'
import { translate } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import { CityModel, ExtraModel } from '@integreat-app/integreat-api-client'

type JsonExtraPostType = {
  [key: string]: string
}

export const createPostMap = (jsonPost: JsonExtraPostType): Map<string, string> => {
  const map = new Map()
  Object.keys(jsonPost).forEach(key => map.set(key, jsonPost[key]))
  return map
}

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = state.language

  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')

  // Mock data
  const extras = [{
    'alias': 'sprungbrett',
    'name': 'Sprungbrett',
    'url': 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
    'post': null,
    'thumbnail': 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/sprungbrett.jpg'
  }, {
    'alias': 'lehrstellen-radar',
    'name': 'Lehrstellenradar',
    'url': 'https://www.lehrstellen-radar.de/5100,0,lsrlist.html',
    'post': {'search-plz': '86150', 'search-radius': '50', 'search-ls': '1', 'search-pr': '1'},
    'thumbnail': 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/lehrstellen-radar.jpg'
  }, {
    'alias': 'ihk-lehrstellenboerse',
    'name': 'IHK Lehrstellenb\u00f6rse',
    'url': 'https://www.ihk-lehrstellenboerse.de/joboffers/search.html?location=86150&distance=1',
    'post': null,
    'thumbnail': 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/ihk-lehrstellenboerse.png'
  }, {
    'alias': 'ihk-praktikumsboerse',
    'name': 'IHK Praktikumsb\u00f6rse',
    'url': 'https://www.ihk-lehrstellenboerse.de/joboffers/searchTrainee.html?location=86150&distance=1',
    'post': null,
    'thumbnail': 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/ihk-praktikumsboerse.png'
  }, {
    'alias': 'wohnen',
    'name': 'Raumfrei',
    'url': 'https://raumfrei.neuburg-schrobenhausen.de',
    'post': {'api-name': 'neuburgschrobenhausenwohnraum'},
    'thumbnail': 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/raumfrei.jpg'
  }
  ].map(extra => new ExtraModel({
    alias: extra.alias,
    title: extra.name,
    path: extra.url,
    // Important. Disables caching of the extras' thumbnails. We want to do it manually at some point.
    thumbnail: extra.thumbnail,
    postData: extra.post ? createPostMap(extra.post) : null
  }))

  const navigateToExtra = (path: string, isExternalUrl: boolean, offerHash: ?string = null) => {
    if (isExternalUrl) {
      Linking.openURL(path)
    } else if (ownProps.navigation.push) {
      const params = {city: targetCity, extras: extras, offerHash: offerHash}
      ownProps.navigation.push(path, params)
    }
  }

  return {
    city: targetCity,
    language: language,
    extras: extras,
    navigateToExtra: navigateToExtra
  }
}

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(Extras)
