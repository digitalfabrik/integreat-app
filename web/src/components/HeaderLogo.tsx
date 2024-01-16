import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'

type HeaderLogoProps = {
  link: string
}

const LogoContainer = styled.div`
  box-sizing: border-box;
  block-size: ${dimensions.headerHeightLarge}px;
  padding: 0 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: initial;
  order: 1;

  & a {
    inline-size: 100%;
    block-size: 60%;
  }

  & img {
    block-size: 100%;
    max-inline-size: 100%;
    object-fit: contain;
    object-position: left;
  }

  @media ${dimensions.smallViewport} {
    block-size: ${dimensions.headerHeightSmall}px;
    max-inline-size: ${dimensions.headerHeightSmall}px;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
    & a {
      max-block-size: 75%;
    }
  }
`

/**
 * A logo component designed for the Header.
 */
export const HeaderLogo = ({ link }: HeaderLogoProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { campaign, appName, icons } = buildConfig()
  const currentDate = DateTime.now()
  const showCampaignLogo =
    campaign && currentDate > DateTime.fromISO(campaign.startDate) && currentDate < DateTime.fromISO(campaign.endDate)
  const src = showCampaignLogo ? campaign.campaignAppLogo : icons.appLogo
  const srcMobile = showCampaignLogo ? campaign.campaignAppLogoMobile : icons.appLogoMobile

  return (
    <LogoContainer>
      <Link to={link}>
        <img src={viewportSmall ? srcMobile : src} alt={appName} width='100%' height='auto' />
      </Link>
    </LogoContainer>
  )
}

export default HeaderLogo
