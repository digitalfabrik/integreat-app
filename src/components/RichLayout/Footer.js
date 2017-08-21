import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import Navigation from 'Navigation'
import style from './Footer.css'

class Footer extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    let {t} = this.props
    return (
      <div className={style.footer}>
        {!isEmpty(this.props.navigation.disclaimer) &&
        <NavLink className={style.item}
                 exact to={this.props.navigation.disclaimer}>
          {t('imprintAndContact')}
        </NavLink>
        }
      </div>
    )
  }
}

export default translate('Footer')(Footer)
