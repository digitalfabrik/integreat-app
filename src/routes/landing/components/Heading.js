import React from 'react'

import LocationBig from '../assets/LocationBig.svg'
import style from './Heading.css'
import { translate } from 'react-i18next'
import Caption from 'modules/common/components/Caption'
import PropTypes from 'prop-types'

class Heading extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render () {
    const {t} = this.props
    return (
      <div>
        <img className={style.logo} src={LocationBig} />
        <Caption className={style.caption} title={t('where')} />
      </div>
    )
  }
}

export default translate('landing')(Heading)
