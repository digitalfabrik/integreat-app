import React from 'react'

import LocationBig from './assets/LocationBig.png'
import style from './Heading.css'
import { translate } from 'react-i18next'

class Heading extends React.Component {
  render () {
    const {t} = this.props
    return (
      <div>
        <div>
          <img className={style.logo} src={LocationBig}/>
        </div>
        <div>
          <h1 className={style.heading}>{t('LocationSelector:where')}</h1>
        </div>
      </div>
    )
  }
}

export default translate('Location')(Heading)
