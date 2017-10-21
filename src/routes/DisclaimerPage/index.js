import React from 'react'
import PropTypes from 'prop-types'

import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import PageModel from 'endpoints/models/PageModel'
import withFetcher from 'endpoints/withFetcher'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'

class ContentWrapper extends React.Component {
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

const FetchingContentWrapper = withFetcher(DISCLAIMER_ENDPOINT)(ContentWrapper)

class DisclaimerPage extends React.Component {
  render () {
    return (
      <RichLayout>
        <FetchingContentWrapper/>
      </RichLayout>
    )
  }
}

export default DisclaimerPage
