import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Error from 'components/Error'
import RichLayout from 'components/RichLayout'

class ErrorPage extends React.Component {
  static propTypes = {
    location: PropTypes.string
  }

  render () {
    if (this.props.location) {
      // Location can be undefined if the url does not contain a location
      return (
        <RichLayout location={this.props.location}>
          <Error error="errors:page.notFound"/>
        </RichLayout>
      )
    } else {
      return <Error error="errors:page.notFound"/>
    }
  }
}

function mapStateToProps (state) {
  const location = state.router.params ? state.router.params.location : null
  return {location}
}

export default connect(mapStateToProps)(ErrorPage)
