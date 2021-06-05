import React, { ReactNode } from 'react'
import { CATEGORIES_ROUTE, EVENTS_ROUTE, NotFoundError, OFFERS_ROUTE, POIS_ROUTE } from 'api-client'
import Failure from './Failure'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client/src/routes'
import { RoutePatterns } from '../routes/RootSwitcher'
import { generatePath } from 'react-router-dom'

type PropsType = {
  error: Error
}

export class FailureSwitcher extends React.Component<PropsType> {
  /**
   * Renders a Failure with a link to the "home" of the route and information about what was not found
   * @param error
   * @return {*}
   */
  static renderContentNotFoundComponent(error: NotFoundError): ReactNode {
    const { city, language } = error

    const params = { cityCode: city, languageCode: language }
    // @ts-ignore TODO IGAPP-668 Wrong type for * parameters
    const categoriesPath = generatePath(RoutePatterns[CATEGORIES_ROUTE], params)
    const eventsPath = generatePath(RoutePatterns[EVENTS_ROUTE], params)
    const offersPath = generatePath(RoutePatterns[OFFERS_ROUTE], params)
    const poisPath = generatePath(RoutePatterns[POIS_ROUTE], params)
    const localNewsPath = generatePath(RoutePatterns[LOCAL_NEWS_TYPE], params)
    const tunewsPath = generatePath(RoutePatterns[TU_NEWS_TYPE], params)

    switch (error.type) {
      case 'category':
        return <Failure goToPath={categoriesPath} goToMessage='goTo.categories' errorMessage='notFound.category' />
      case 'event':
        return <Failure goToPath={eventsPath} goToMessage='goTo.events' errorMessage='notFound.event' />
      case LOCAL_NEWS_TYPE:
        return <Failure goToPath={localNewsPath} goToMessage='goTo.localNews' errorMessage='notFound.localNews' />
      case TU_NEWS_TYPE:
        return <Failure goToPath={tunewsPath} goToMessage='goTo.tunews' errorMessage='notFound.tunews' />
      case 'offer':
        return <Failure goToPath={offersPath} goToMessage='goTo.offers' errorMessage='notFound.offer' />
      case 'poi':
        return <Failure goToPath={poisPath} goToMessage='goTo.pois' errorMessage='notFound.poi' />
    }

    throw new Error('Failed to find component to render a content error')
  }

  render() {
    const error = this.props.error
    if (error instanceof NotFoundError) {
      return FailureSwitcher.renderContentNotFoundComponent(error)
    } else {
      return <Failure errorMessage={error.message} />
    }
  }
}

export default FailureSwitcher
