// @flow

import * as React from 'react'
import ContentNotFoundError from '../errors/ContentNotFoundError'
import Failure from './Failure'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import CategoriesRouteConfig from '../../app/route-configs/CategoriesRouteConfig'
import EventsRouteConfig from '../../app/route-configs/EventsRouteConfig'
import ExtrasRouteConfig from '../../app/route-configs/ExtrasRouteConfig'
import PoisRouteConfig from '../../app/route-configs/PoisRouteConfig'

type PropsType = {|
  error: Error,
  t: TFunction
|}

export class FailureSwitcher extends React.Component<PropsType> {
  /**
   * Renders a Failure with a link to the "home" of the route and information about what was not found
   * @param error
   * @return {*}
   */
  static renderContentNotFoundComponent (error: ContentNotFoundError): React.Node {
    const { city, language } = error
    switch (error.type) {
      case 'category':
        return <Failure goToPath={new CategoriesRouteConfig().getRoutePath({ city, language })}
                        goToMessage='goTo.categories'
                        errorMessage='notFound.category' />
      case 'event':
        return <Failure goToPath={new EventsRouteConfig().getRoutePath({ city, language })}
                        goToMessage='goTo.events'
                        errorMessage='notFound.event' />
      case 'extra':
        return <Failure goToPath={new ExtrasRouteConfig().getRoutePath({ city, language })}
                        goToMessage='goTo.extras'
                        errorMessage='notFound.extra' />
      case 'poi':
        return <Failure goToPath={new PoisRouteConfig().getRoutePath({ city, language })}
                        goToMessage='goTo.pois'
                        errorMessage='notFound.poi' />
    }

    throw new Error('Failed to find component to render a content error')
  }

  render () {
    const error = this.props.error
    if (error instanceof ContentNotFoundError) {
      return FailureSwitcher.renderContentNotFoundComponent(error)
    } else {
      return <Failure errorMessage={error.message} />
    }
  }
}

export default withTranslation('error')(FailureSwitcher)
