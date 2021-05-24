import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import { withTranslation, TFunction } from 'react-i18next'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  viewportSmall: boolean,
  t: TFunction
}

const GeneralHeader = ({ viewportSmall, t }: PropsType) => {
  // const getPath = new I18nRedirectRouteConfig().getRoutePath
  // TODO use right path
  const getPath = () => '/'

  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing' href={getPath()} iconSrc={landingIcon} text={t('changeLocation')} />]
    : []

  const onStickyTopChanged = () => {}

  return (
    <Header
      viewportSmall={viewportSmall}
      onStickyTopChanged={onStickyTopChanged}
      logoHref={getPath()}
      actionItems={actionItems}
      navigationItems={[]}
    />
  )
}

export default withTranslation('layout')(GeneralHeader)
