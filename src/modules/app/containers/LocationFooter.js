import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Navigation from 'modules/app/Navigation'
import Footer from '../../layout/components/Footer'

class LocationFooter extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    const text = this.props.t('imprintAndContact')
    const href = this.props.navigation.disclaimer
    return <Footer items={[{text, href}]} />
  }
}

const mapStateToProps = (state) => ({
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default compose(
  connect(mapStateToProps),
  translate('app')
)(LocationFooter)
