import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'

import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Link from './base/Link'

type HeaderLogoProps = {
  link: string
}

const LogoContainer = styled('div')`
  box-sizing: border-box;
  padding: 0 10px;
  flex: initial;
  order: 1;

  & a {
    display: block;
    width: 100%;
    height: 48px;

    ${props => props.theme.breakpoints.down('md')} {
      width: 30px;
    }
  }
`

const StyledLogo = styled(SVG)`
  color: ${props => props.theme.legacy.colors.textColor};
  height: 100%;
  width: fit-content;

  ${props => props.theme.breakpoints.down('md')} {
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
  const { viewportSmall } = useWindowDimensions()

  return (
    <LogoContainer>
      <Link to={link}>
        <StyledLogo src={viewportSmall ? srcMobile : src} title={appName} />
      </Link>
    </LogoContainer>
  )
}

export default HeaderLogo
