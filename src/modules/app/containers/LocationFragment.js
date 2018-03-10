import { Fragment } from 'redux-little-router'
import React from 'react'

import PropTypes from 'prop-types'
import RouteConfig from '../RouteConfig'
import { connect } from 'react-redux'
import LanguageModel from '../../endpoint/models/LanguageModel'
import withFetcher from '../../endpoint/hocs/withFetcher'
import LocationModel from '../../endpoint/models/LocationModel'
import LanguageFragment from './LanguageFragment'
import LanguageFailure from '../../../routes/categories/containers/LanguageFailure'
import { languagesUrlMapper } from '../../endpoint/urlMappers'
import languagesMapper from '../../endpoint/mappers/languages'

class LocationFragment extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired
  }

  isLanguage = router => this.props.languages.find(language => language.code === router.params.language)

  render () {
    const {locations, languages, routeConfig} = this.props

    return <React.Fragment>
      <Fragment forRoute='' withConditions={this.isLanguage} >
        <LanguageFragment locations={locations} languages={languages} routeConfig={routeConfig} />
      </Fragment>

      <Fragment forNoMatch>
        <LanguageFailure languages={languages} locations={locations} />
      </Fragment>
    </React.Fragment>
  }
}

class Container extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    location: PropTypes.string.isRequired,
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired
  }

  render () {
    const {locations, location, routeConfig} = this.props

    const LocationFragmentWithFetcher = withFetcher(
      'languages', languagesUrlMapper, languagesMapper, {location: location}
    )(LocationFragment)

    return <LocationFragmentWithFetcher locations={locations} routeConfig={routeConfig} />
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location
})

export default connect(mapStateToProps)(Container)
