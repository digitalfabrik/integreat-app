import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Navigation from 'modules/app/Navigation'
import LanguageSelector from './LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/locations'
import Header from 'modules/layout/components/Header'

class LocationHeader extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    location: PropTypes.instanceOf(LocationModel).isRequired,
    route: PropTypes.string.isRequired
  }

  isCategoriesEnabled = () => this.isExtrasEnabled() || this.isEventsEnabled()

  isExtrasEnabled = () => this.props.location.extrasEnabled

  isEventsEnabled = () => this.props.location.eventsEnabled

  isExtrasSelected = () => this.props.route === '/:location/:language/extras'

  isCategoriesSelected = () => ['/:location/:language', '/:location/:language/*'].includes(this.props.route)

  isEventsSelected = () => this.props.route === '/:location/:language/events(/:id)'

  getActionItems () {
    const {navigation} = this.props
    return [
      {href: navigation.search, iconSrc: searchIcon},
      {href: navigation.locationSelector, iconSrc: locationIcon},
      {dropDownNode: <LanguageSelector />, iconSrc: languageIcon}
    ]
  }

  getMenuItems () {
    const {t, navigation} = this.props
    const extras = this.isExtrasEnabled() &&
      {href: navigation.extras, active: this.isExtrasSelected(), text: t('extras')}

    const categories = this.isCategoriesEnabled() &&
      {href: navigation.categories, active: this.isCategoriesSelected(), text: t('categories')}

    const events = this.isEventsEnabled() &&
      {href: navigation.events, active: this.isEventsSelected(), text: t('news')}

    return [extras, categories, events].filter(item => item)
  }

  render () {
    return <Header actionItems={this.getActionItems()} menuItems={this.getMenuItems()} />
  }
}

const mapStateToProps = (state) => ({
  route: state.router.route,
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATIONS_ENDPOINT, true, true),
  translate('app')
)(LocationHeader)
