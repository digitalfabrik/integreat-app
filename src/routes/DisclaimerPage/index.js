import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'
import Payload from '../../endpoints/Payload'
import Page from 'components/Content/Page'
import PageLayout from 'components/PageLayout'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class DisclaimerPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    disclaimerPayload: PropTypes.instanceOf(Payload).isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(DISCLAIMER_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.fetchData(this.props.language)
  }

  fetchData (language) {
    let location = this.getLocation()
    this.props.dispatch(DISCLAIMER_ENDPOINT.fetchEndpointAction({
      location: location,
      language: language,
      since: BIRTH_OF_UNIVERSE
    }, {Location: location}))
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <PageLayout location={this.getLocation()}>
        { this.props.disclaimerPayload.data ? <Page page={this.props.disclaimerPayload.data}/> : null }
      </PageLayout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{disclaimerPayload: *, language}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return {
    disclaimerPayload: state.disclaimer,
    language: state.language.language
  }
}

export default connect(mapStateToProps)(DisclaimerPage)
