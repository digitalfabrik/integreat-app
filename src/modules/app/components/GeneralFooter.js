import React from 'react'
import { translate } from 'react-i18next'
import Footer from 'modules/layout/components/Footer'

class GeneralFooter extends React.Component {
  render () {
    return <Footer items={[{href: '/', text: this.props.t('imprintAndContact')}]} />
  }
}

export default translate('app')(GeneralFooter)
