// @flow

import { connect } from 'react-redux'
import { Linking } from 'react-native'
import Extras from '../components/Extras'
import { translate } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import { compose } from 'recompose'

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = state.language

  const targetCity: string = ownProps.navigation.getParam('city')

  const navigateToExtras = (path: string, isExternalUrl: boolean) => {
    const params = {city: targetCity}
    if (isExternalUrl) {
      Linking.openURL(path)
    } else if (ownProps.navigation.push) {
      ownProps.navigation.push(path, params)
    }
  }

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
  }]

  return {
    city: targetCity,
    language: language,
    extras: extras,
    navigateToExtras: navigateToExtras
  }
}

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(Extras)
