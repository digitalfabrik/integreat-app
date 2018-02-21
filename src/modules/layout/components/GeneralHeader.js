import React from 'react'
import locationIcon from '../assets/location-icon.svg'
import Header from '../containers/Header'
import HeaderActionItem from '../HeaderActionItem'

class GeneralHeader extends React.Component {
  render () {
    return <Header actionItems={[new HeaderActionItem({href: '/', iconSrc: locationIcon})]} />
  }
}

export default GeneralHeader
