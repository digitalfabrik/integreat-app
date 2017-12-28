import React from 'react'
import locationIcon from '../assets/location-icon.svg'
import Header from 'modules/layout/components/Header'

class GeneralHeader extends React.Component {
  render () {
    return <Header actionItems={[{href: '/', iconSrc: locationIcon}]} />
  }
}

export default GeneralHeader
