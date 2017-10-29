import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Navigation from 'Navigation'
import style from './Footer.css'
import { Link } from 'redux-little-router'
import { connect } from 'react-redux'

class Footer extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    location: PropTypes.string
  }

  getDisclaimerLink () {
    const {t} = this.props
    if (this.props.location) {
      return <Link className={style.item} href={this.props.navigation.disclaimer}>
        {t('imprintAndContact')}
      </Link>
    } else {
      return <Link className={style.item} href='/disclaimer'>
        {t('imprintAndContact')}
      </Link>
    }
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
    return (
      <div className={style.footer}>
        {this.getDisclaimerLink()}
        {this.getVersion()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const location = state.router.params.location
  const language = state.router.params.language
  return {
    location,
    navigation: new Navigation(location, language)
  }
}

export default connect(mapStateToProps)(translate('Footer')(Footer))
