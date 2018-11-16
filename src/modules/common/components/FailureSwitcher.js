// @flow

import * as React from 'react'
import ContentNotFoundError from '../errors/ContentNotFoundError'
import Failure from './Failure'
import LanguageFailure from '../containers/LanguageFailure'
import { getEventsPath } from '../../app/routes/events'
import { getExtrasPath } from '../../app/routes/extras'
import LanguageNotFoundError from '../../app/errors/LanguageNotFoundError'
import Helmet from 'react-helmet'

import CityNotFoundError from '../../app/errors/CityNotFoundError'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { getPoisPath } from '../../app/routes/pois'
import { getCategoriesPath } from '../../app/routes/categories'

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
    const {city, language} = error
    switch (error.type) {
      case 'category':
        return <Failure goToPath={getCategoriesPath({city, language})}
                        goToMessage={'goTo.categories'}
                        errorMessage={'not-found.category'} />
      case 'event':
        return <Failure goToPath={getEventsPath({city, language})}
                        goToMessage={'goTo.events'}
                        errorMessage={'not-found.event'} />
      case 'extra':
        return <Failure goToPath={getExtrasPath({city, language})}
                        goToMessage={'goTo.extras'}
                        errorMessage={'not-found.extra'} />
      case 'poi':
        return <Failure goToPath={getPoisPath({city, language})}
                        goToMessage={'goTo.pois'}
                        errorMessage={'not-found.poi'} />
    }

    throw new Error('Failed to find component to render a content error')
  }

  /**
   * Decides which kind of error should be rendered
   * @return {*}
   */
  renderErrorComponent (): React.Node {
    const error = this.props.error
    if (error instanceof ContentNotFoundError) {
      return FailureSwitcher.renderContentNotFoundComponent(error)
    } else if (error instanceof LanguageNotFoundError) {
      return <LanguageFailure city={error.city} />
    } else {
      return <Failure errorMessage={error.message} />
    }
  }

  getErrorName (): string {
    const {t, error} = this.props
    if (error instanceof CityNotFoundError ||
        error instanceof LanguageNotFoundError ||
        error instanceof ContentNotFoundError) {
      return t('not-found.pageTitle')
    }
    return t('pageTitle')
  }

  render () {
    return <>
      <Helmet>
        <title>{this.getErrorName()}</title>
      </Helmet>
      {this.renderErrorComponent()}
    </>
  }
}

export default translate('error')(FailureSwitcher)
