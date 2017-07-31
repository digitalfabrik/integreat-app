import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'
import Payload from '../../endpoints/Payload'
import Page from 'components/Content/Page'
import HeaderLayout from 'components/HeaderLayout'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class DisclaimerPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    disclaimerPayload: PropTypes.instanceOf(Payload).isRequired
  }

  getLocation () {
    return this.props.match.params.location
  }

  getUrlOptions () {
    return {
      location: this.getLocation(),
      language: this.props.language,
      since: BIRTH_OF_UNIVERSE
    }
  }

  getTransformOptions () {
    return {
      location: this.getLocation()
    }
  }

  render () {
    return (
      <HeaderLayout location={this.getLocation()}>
        <Fetcher endpoint={DISCLAIMER_ENDPOINT}
                 urlOptions={this.getUrlOptions()}
                 transformOptions={this.getTransformOptions()}>

          { this.props.disclaimerPayload.data &&
          <Page page={this.props.disclaimerPayload.data}/>
          }

        </Fetcher>
      </HeaderLayout>
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
