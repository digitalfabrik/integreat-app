import React from 'react'
import PropTypes from 'prop-types'

import Page from 'routes/location/components/Page'
import PageModel from 'modules/endpoint/models/PageModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher/index'
import DISCLAIMER_ENDPOINT from 'modules/endpoint/endpoints/disclaimer'
import compose from 'redux/es/compose'
import withAvailableLanguageUpdater from 'modules/app/hocs/withAvailableLanguageUpdater'

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

export default compose(
  withFetcher(DISCLAIMER_ENDPOINT),
  withAvailableLanguageUpdater((location, language) => `/${location}/${language}/disclaimer`)
)(DisclaimerPage)
