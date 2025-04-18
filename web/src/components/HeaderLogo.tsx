import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Icon from './base/Icon'
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

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    max-width: ${dimensions.headerHeightSmall}px;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
    & a {
      max-height: 75%;
    }
  }
`

const StyledLogoIcon = styled(Icon)`
  color: ${props => props.theme.colors.textColor};
  height: 100%;
  width: 200px;
  max-width: 200px;

  @media ${dimensions.smallViewport} {
    max-width: 44px;
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
        <StyledLogoIcon src={viewportSmall ? srcMobile : src} title={appName} />
      </Link>
    </LogoContainer>
  )
}

export default HeaderLogo
