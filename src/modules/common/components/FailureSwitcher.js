// @flow

import * as React from 'react'
import ContentNotFoundError from '../errors/ContentNotFoundError'
import Failure from './Failure'
import LanguageFailure from '../containers/LanguageFailure'
import { goToEvents } from '../../app/routes/events'
import { goToExtras } from '../../app/routes/extras'
import { goToCategories } from '../../app/routes/categories'
import LanguageNotFoundError from '../../app/errors/LanguageNotFoundError'

type Props = {
  error: Error
}

class FailureSwitcher extends React.Component<Props> {
  /**
   * Renders a Failure with a link to the "home" of the route and information about what was not found
   * @param error
   * @return {*}
   */
  static renderContentNotFoundComponent (error: ContentNotFoundError): React.Node {
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

  render () {
    return this.renderErrorComponent()
  }
}

export default FailureSwitcher
