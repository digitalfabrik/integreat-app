import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import Navigation from 'Navigation'
import style from './Footer.css'
import { Link } from 'redux-little-router'

class Footer extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    let {t} = this.props
    return (
      <div className={style.footer}>
        {!isEmpty(this.props.navigation.disclaimer) &&
        <Link className={style.item} href={this.props.navigation.disclaimer}>
          {t('imprintAndContact')}
        </Link>
        }
      </div>
    )
  }
}

export default translate('Footer')(Footer)
