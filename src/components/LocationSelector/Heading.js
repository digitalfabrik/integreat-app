import React from 'react'

import LocationBig from './assets/LocationBig.svg'
import style from './Heading.css'
import { translate } from 'react-i18next'

class Heading extends React.Component {
  render () {
    const {t} = this.props
    return (
      <div>
        <img className={style.logo} src={LocationBig}/>
        <div>
          <h1 className={style.heading}>{t('Location:where')}</h1>
        </div>
      </div>
    )
  }
}

export default translate('Location')(Heading)
