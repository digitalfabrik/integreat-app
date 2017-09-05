/**
 * @param state The current app state
 * @return {{language}}  The endpoint values from the state mapped to props
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import { DisclaimerFetcher } from 'endpoints'
import { setLanguage } from '../../actions'

class PageAdapter extends React.Component {
  render () {
    return <Page page={this.props.disclaimer}/>
  }
}

class DisclaimerPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired
  }

  getLocation () {
    return 'augsburg'
  }

  render () {
    return (
      <RichLayout location={this.getLocation()}>
        <DisclaimerFetcher options={{location: this.getLocation()}}>
          <PageAdapter/>
        </DisclaimerFetcher>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    language: state.language.language
  }
}

export default connect(mapStateToProps)(DisclaimerPage)
