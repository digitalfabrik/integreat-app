import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import { withTranslation, TFunction } from 'react-i18next'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  landingPath: string
  viewportSmall: boolean
  t: TFunction
}

const GeneralHeader = ({ landingPath, viewportSmall, t }: PropsType) => {
  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing' href={landingPath} iconSrc={landingIcon} text={t('changeLocation')} />]
    : []

  const onStickyTopChanged = () => {}

  return (
    <Header
      viewportSmall={viewportSmall}
      onStickyTopChanged={onStickyTopChanged}
      logoHref={landingPath}
      actionItems={actionItems}
      navigationItems={[]}
    />
  )
}

export default withTranslation('layout')(GeneralHeader)
