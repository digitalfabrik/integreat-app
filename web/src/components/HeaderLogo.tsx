import moment from 'moment'
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
  height: ${dimensions.headerHeightLarge}px;
  padding: 0 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: 0 1 220px;
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
  const { campaign, appName, icons } = buildConfig()
  const currentDate = moment()
  const showCampaignLogo = campaign && currentDate.isAfter(campaign.startDate) && currentDate.isBefore(campaign.endDate)
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
