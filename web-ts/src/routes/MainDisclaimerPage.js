// @flow

import React from 'react'
import Caption from '../../../modules/common/components/Caption'
import buildConfig from '../../../modules/app/constants/buildConfig'

type PropsType = {||}

class MainDisclaimerPage extends React.Component<PropsType> {
  render() {
    return (
      <div>
        <Caption title='Impressum und Datenschutz' />
        <div dangerouslySetInnerHTML={{ __html: buildConfig().mainImprint }} />
      </div>
    )
  }
}

export default MainDisclaimerPage
