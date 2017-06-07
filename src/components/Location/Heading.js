import React from 'react'

import LocationBig from './assets/LocationBig.png'
import style from './Heading.css'

class Heading extends React.Component {
  render () {
    return (
      <div>
        <div>
          <img className={style.logo} src={LocationBig}/>
        </div>
        <div>
          <h1 className={style.heading}>Where are you?</h1>
        </div>
      </div>
    )
  }
}

export default Heading
