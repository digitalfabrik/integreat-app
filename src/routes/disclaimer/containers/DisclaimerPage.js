import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'

import Page from 'routes/content/components/Page'
import PageModel from 'modules/endpoint/models/PageModel'
import withFetcher from 'modules/endpoint/hocs'
import DISCLAIMER_ENDPOINT from 'modules/endpoint/endpoints/disclaimer'
import withAvailableLanguageUpdater from 'modules/language/hocs/withAvailableLanguageUpdater'

class DisclaimerPage extends React.Component {
  static propTypes = {
    /**
     * from withFetcher HOC which provides data from DISCLAIMER_ENDPOINT
     */
    disclaimer: PropTypes.instanceOf(PageModel)
  }

  render () {
    return <Page page={this.props.disclaimer}/>
  }
}

const mapLanguageToUrl = (location, language, id) => `/${location}/${language}/disclaimer`

export default compose(
  withFetcher(DISCLAIMER_ENDPOINT),
  withAvailableLanguageUpdater(mapLanguageToUrl)
)(DisclaimerPage)
