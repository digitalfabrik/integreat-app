import { Fragment } from 'redux-little-router'
import React from 'react'

import LocationLayout from '../../layout/containers/LocationLayout'
import SearchPage from 'routes/search/containers/SearchPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import EventsPage from 'routes/events/containers/EventsPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import ExtrasPage from 'routes/extras/containers/ExtrasPage'
import PropTypes from 'prop-types'
import RouteConfig from '../RouteConfig'
import { connect } from 'react-redux'
import LocationModel from '../../endpoint/models/LocationModel'
import LanguageModel from '../../endpoint/models/LanguageModel'
import withFetcher from '../../endpoint/hocs/withFetcher'
import compose from 'lodash/fp/compose'
import EventModel from '../../endpoint/models/EventModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import DisclaimerModel from '../../endpoint/models/DisclaimerModel'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { categoriesUrlMapper, disclaimerUrlMapper, eventsUrlMapper, extrasUrlMapper } from '../../endpoint/urlMappers'
import categoriesMapper from '../../endpoint/mappers/categories'
import disclaimerMapper from '../../endpoint/mappers/disclaimer'
import eventsMapper from '../../endpoint/mappers/events'
import extrasMapper from '../../endpoint/mappers/extras'

export class LanguageFragment extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired,
    disclaimer: PropTypes.instanceOf(DisclaimerModel).isRequired,
    categories: PropTypes.instanceOf(CategoriesMapModel).isRequired,
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired
  }

  /**
   * This is the matchRoute from the supplied {@link routeConfig}
   *
   * @param id The id to look for
   * @returns {*|Route}
   */
  matchRoute = id => this.props.routeConfig.matchRoute(id)

  render () {
    const {locations, languages, categories, events, extras, disclaimer} = this.props

    return <React.Fragment>
      <LocationLayout matchRoute={this.matchRoute} locations={locations} events={events} languages={languages}>
        {/* Matches /augsburg/de/search -> Search */}
        <Fragment forRoute='/search'>
          <SearchPage locations={locations} languages={languages} categories={categories} />
        </Fragment>
        {/* Matches /augsburg/de/disclaimer -> Disclaimer */}
        <Fragment forRoute='/disclaimer'>
          <DisclaimerPage disclaimer={disclaimer} languages={languages} />
        </Fragment>
        {/* Matches /augsburg/de/events* -> Events */}
        <Fragment forRoute='/events(/:id)'>
          <EventsPage languages={languages} events={events} />
        </Fragment>
        {/* Matches /augsburg/de/fetch-pdf/* -> Pdf */}
        <Fragment forRoute='/fetch-pdf'>
          <PdfFetcherPage categories={categories} locations={locations} />
        </Fragment>
        {/* Matches /augsburg/de/extras* -> Extras */}
        <Fragment forRoute='/extras(/:extra)'>
          <ExtrasPage languages={languages} extras={extras} />
        </Fragment>
        {/* Matches /augsburg/de/* -> Content */}
        <Fragment forNoMatch>
          <CategoriesPage languages={languages} locations={locations} categories={categories} />
        </Fragment>
      </LocationLayout>
    </React.Fragment>
  }
}

class Container extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    const {locations, languages, location, language, routeConfig} = this.props
    const params = {location: location, language: language}

    const LanguageFragmentWithFetchers = compose(
      withFetcher('categories', categoriesUrlMapper, categoriesMapper, params),
      withFetcher('disclaimer', disclaimerUrlMapper, disclaimerMapper, params),
      withFetcher('events', eventsUrlMapper, eventsMapper, params),
      withFetcher('extras', extrasUrlMapper, extrasMapper, params)
    )(LanguageFragment)

    return <LanguageFragmentWithFetchers locations={locations} languages={languages} routeConfig={routeConfig} />
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language
})

export default connect(mapStateToProps)(Container)
