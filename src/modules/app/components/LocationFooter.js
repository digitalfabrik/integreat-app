import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Navigation from 'modules/app/Navigation'
import Footer from 'modules/layout/components/Footer'

class LocationFooter extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    const {t, navigation} = this.props
    return <Footer items={[{text: t('imprintAndContact'), href: navigation.disclaimer}]} />
  }
}

export default translate('app')(LocationFooter)
