import React, { ReactNode } from 'react'
import { NotFoundError } from 'api-client'
import Failure from './Failure'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client/src/routes'

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
    switch (error.type) {
      case 'category':
        return (
          <Failure
            // TODO use right redirect path
            // goToPath={new CategoriesRouteConfig().getRoutePath({ city, language })}
            goToMessage='goTo.categories'
            errorMessage='notFound.category'
          />
        )
      case 'event':
        return (
          <Failure
            // TODO use right redirect path
            // goToPath={new EventsRouteConfig().getRoutePath({ city, language })}
            goToMessage='goTo.events'
            errorMessage='notFound.event'
          />
        )
      case LOCAL_NEWS_TYPE:
        return (
          <Failure
            // TODO use right redirect path
            // goToPath={new LocalNewsRouteConfig().getRoutePath({ city, language })}
            goToMessage='goTo.localNews'
            errorMessage='notFound.localNews'
          />
        )
      case TU_NEWS_TYPE:
        return (
          <Failure
            // TODO use right redirect path
            // goToPath={new TunewsRouteConfig().getRoutePath({ city, language })}
            goToMessage='goTo.tunews'
            errorMessage='notFound.tunews'
          />
        )
      case 'offer':
        return (
          <Failure
            // TODO use right redirect path
            // goToPath={new OffersRouteConfig().getRoutePath({ city, language })}
            goToMessage='goTo.offers'
            errorMessage='notFound.offer'
          />
        )
      case 'poi':
        return (
          <Failure
            // TODO use right redirect path
            // goToPath={new PoisRouteConfig().getRoutePath({ city, language })}
            goToMessage='goTo.pois'
            errorMessage='notFound.poi'
          />
        )
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
