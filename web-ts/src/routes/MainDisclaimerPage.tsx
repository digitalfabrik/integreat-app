import React from 'react'
import Caption from 'src/components/Caption'
import buildConfig from '../constants/buildConfig'

const MainDisclaimerPage = () => {
  return (
    <div>
      <Caption title='Impressum und Datenschutz' />
      <div
        dangerouslySetInnerHTML={{
          __html: buildConfig().mainImprint
        }}
      />
    </div>
  )
}

export default MainDisclaimerPage
