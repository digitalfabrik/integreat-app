import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import Footer from './Footer'

class GeneralFooter extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }
  render () {
    return <Footer items={[{href: '/disclaimer', text: this.props.t('imprintAndContact')}]} />
  }
}

export default translate('app')(GeneralFooter)
