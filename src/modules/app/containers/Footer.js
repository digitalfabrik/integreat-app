import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Navigation from 'modules/app/Navigation'
import style from './Footer.css'
import { Link } from 'redux-little-router'
import { connect } from 'react-redux'

class Footer extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  getVersion () {
    // eslint-disable-next-line no-undef
    if (__DEV__) {
      // eslint-disable-next-line no-undef
      return <div className={style.item}>{__VERSION__}</div>
    }

    return null
  }

  render () {
    const {t, navigation} = this.props
    return (
      <div className={style.footer}>
        <Link className={style.item} href={navigation.disclaimer}>{t('imprintAndContact')}</Link>
        {this.getVersion()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default connect(mapStateToProps)(translate('app')(Footer))
