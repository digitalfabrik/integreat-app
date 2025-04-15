import { DateTime } from 'luxon'
import React, { ReactElement, useState, useEffect } from 'react'
import styled from 'styled-components'

import { webIntegreatBuildConfig } from 'build-configs/integreat'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { useContrastTheme } from '../hooks/useContrastTheme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Link from './base/Link'

type HeaderLogoProps = {
  link: string
}

const LogoContainer = styled.div`
  box-sizing: border-box;
  height: ${dimensions.headerHeightLarge}px;
  padding: 0 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: initial;
  order: 1;

  & a {
    width: 100%;
    height: 60%;
  }

  & img {
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    object-position: left;
  }

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    max-width: ${dimensions.headerHeightSmall}px;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
    & a {
      max-height: 75%;
    }
  }
`

/**
 * A logo component designed for the Header.
 */
export const HeaderLogo = ({ link }: HeaderLogoProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { campaign, appName } = buildConfig()
  const { isContrastTheme } = useContrastTheme()
  const [appLogoConfig, setAppLogoConfig] = useState(webIntegreatBuildConfig)

  // Mutates the config to dynamically change the app logo if the high contrast activated
  useEffect(() => {
    const updatedAppLogoConfig = {
      ...webIntegreatBuildConfig,
      icons: {
        ...webIntegreatBuildConfig.icons,
        appLogo: isContrastTheme ? '/app-logo-contrast.svg' : '/app-logo.svg',
      },
    }

    setAppLogoConfig(updatedAppLogoConfig)
  }, [isContrastTheme])

  const currentDate = DateTime.now()
  const showCampaignLogo =
    campaign && currentDate > DateTime.fromISO(campaign.startDate) && currentDate < DateTime.fromISO(campaign.endDate)
  const src = showCampaignLogo ? campaign.campaignAppLogo : appLogoConfig.icons.appLogo
  const srcMobile = showCampaignLogo ? campaign.campaignAppLogoMobile : appLogoConfig.icons.appLogoMobile

  return (
    <LogoContainer>
      <Link to={link}>
        <img src={viewportSmall ? srcMobile : src} alt={appName} width='100%' height='auto' />
      </Link>
    </LogoContainer>
  )
}

export default HeaderLogo
