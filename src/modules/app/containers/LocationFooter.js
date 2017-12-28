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
    const {t, navigation} = this.props
    return <Footer items={[{text: t('imprintAndContact'), href: navigation.disclaimer}]} />
  }
}

const mapStateToProps = (state) => ({
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default compose(
  connect(mapStateToProps),
  translate('app')
)(LocationFooter)
