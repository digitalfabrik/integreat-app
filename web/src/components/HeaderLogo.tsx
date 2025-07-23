import styled from '@emotion/styled'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Link from './base/Link'

type HeaderLogoProps = {
  link: string
}

const LogoContainer = styled.div`
  box-sizing: border-box;
  padding: 0 10px;
  flex: initial;
  order: 1;

  & a {
    display: block;
    width: 100%;
    height: 60%;

    @media ${dimensions.smallViewport} {
      height: 42px;
      width: 42px;
    }
  }
`

const StyledLogo = styled.img<{ $small: boolean }>`
  color: ${props => props.theme.colors.textColor};
  height: 100%;
  width: 200px;

  @media ${dimensions.mediumLargeViewport} {
    ${props => (props.$small ? 'display: none;' : '')}
  }

  @media ${dimensions.smallViewport} {
    ${props => (!props.$small ? 'display: none;' : '')}
    width: 100%;
  }
`

/**
 * A logo component designed for the Header.
 */
export const HeaderLogo = ({ link }: HeaderLogoProps): ReactElement => {
  const { campaign, appName, icons } = buildConfig()

  const currentDate = DateTime.now()
  const showCampaignLogo =
    campaign && currentDate > DateTime.fromISO(campaign.startDate) && currentDate < DateTime.fromISO(campaign.endDate)
  const src = showCampaignLogo ? campaign.campaignAppLogo : icons.appLogo
  const srcMobile = showCampaignLogo ? campaign.campaignAppLogoMobile : icons.appLogoMobile

  return (
    <LogoContainer>
      <Link to={link}>
        {/* Using `loading="lazy"` makes the browser only fetch the image that is actually visible */}
        <StyledLogo $small src={srcMobile} alt={appName} loading='lazy' />
        <StyledLogo $small={false} src={src} alt={appName} loading='lazy' />
      </Link>
    </LogoContainer>
  )
}

export default HeaderLogo
