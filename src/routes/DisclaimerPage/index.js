import React from 'react'
import PropTypes from 'prop-types'

import Page from 'components/Content/Page'
import PageModel from 'endpoints/models/PageModel'
import withFetcher from 'endpoints/withFetcher'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'
import compose from 'redux/es/compose'
import withAvailableLanguageUpdater from 'hocs/withAvailableLanguageUpdater'

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
