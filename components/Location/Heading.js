import React from 'react'

import LocationBig from './assets/LocationBig.png'
import content from './Heading.pcss'

class Header extends React.Component {
  render () {
    return (
      <div>
        <div className="row">
          <img className={content.logo} src={LocationBig}/>
        </div>
        <div className="row">
          <h1 className={content.heading}>Where are you?</h1>
        </div>
      </div>
    )
  }
}

export default Header
