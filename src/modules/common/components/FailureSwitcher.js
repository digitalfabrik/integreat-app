// @flow

import React, { Fragment } from 'react'
import ContentNotFoundError from '../errors/ContentNotFoundError'
import Failure from './Failure'
import LanguageFailure from '../containers/LanguageFailure'
import { goToEvents } from '../../app/routes/events'
import { goToExtras } from '../../app/routes/extras'
import { goToCategories } from '../../app/routes/categories'
import LanguageNotFoundError from '../../app/errors/LanguageNotFoundError'
import Helmet from 'react-helmet'

import type { Node } from 'react'
import CityNotFoundError from '../../app/errors/CityNotFoundError'

type Props = {
  error: Error
}

class FailureSwitcher extends React.Component<Props> {
  /**
   * Renders a Failure with a link to the "home" of the route and information about what was not found
   * @param error
   * @return {*}
   */
  static renderContentNotFoundComponent (error: ContentNotFoundError): Node {
    switch (error.type) {
      case 'category':
        return <Failure goToAction={goToCategories(error.city, error.language)}
                        goToMessage={'goTo.categories'}
                        errorMessage={'not-found.category'} />
      case 'event':
        return <Failure goToAction={goToEvents(error.city, error.language)}
                        goToMessage={'goTo.events'}
                        errorMessage={'not-found.event'} />
      case 'extra':
        return <Failure goTo={goToExtras(error.city, error.language)}
                        goToMessage={'goTo.extras'}
                        errorMessage={'not-found.extra'} />
    }
  }

  /**
   * Decides which kind of error should be rendered
   * @return {*}
   */
  renderErrorComponent (): Node {
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
    const error = this.props.error
    if (error instanceof CityNotFoundError ||
        error instanceof LanguageNotFoundError ||
        error instanceof ContentNotFoundError) {
      return 'Not Found'
    }
    return 'Error'
  }

  render () {
    return <Fragment>
      <Helmet>
        <title>{this.getErrorName()}</title>
      </Helmet>
      {this.renderErrorComponent()}
    </Fragment>
  }
}

export default FailureSwitcher
