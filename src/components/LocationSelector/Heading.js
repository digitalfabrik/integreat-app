import React from 'react'

import LocationBig from './assets/LocationBig.png'
import style from './Heading.css'
import { translate } from 'react-i18next'
import Caption from '../Content/Caption'

class Heading extends React.Component {
  render () {
    const {t} = this.props
    return (
      <div>
        <div>
          <img className={style.logo} src={LocationBig}/>
        </div>
        <Caption className={style.caption} title={t('Location:where')}/>
      </div>
    )
  }
}

export default translate('Location')(Heading)
