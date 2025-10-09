import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'
import Svg from './base/Svg'

const StyledLink = styled(Link)(({ theme }) => ({
  order: 1,
  height: 48,

  [theme.breakpoints.down('md')]: {
    width: 48,
  },
}))

type HeaderLogoProps = {
  link: string
}

export const HeaderLogo = ({ link }: HeaderLogoProps): ReactElement => {
  const { campaign, appName, icons } = buildConfig()

  const currentDate = DateTime.now()
  const showCampaignLogo =
    campaign && currentDate > DateTime.fromISO(campaign.startDate) && currentDate < DateTime.fromISO(campaign.endDate)
  const src = showCampaignLogo ? campaign.campaignAppLogo : icons.appLogo
  const srcMobile = showCampaignLogo ? campaign.campaignAppLogoMobile : icons.appLogoMobile
  const { mobile } = useDimensions()

  return (
    <StyledLink to={link} ariaLabel={appName}>
      <Svg src={mobile ? srcMobile : src} width='100%' height='100%' />
    </StyledLink>
  )
}

export default HeaderLogo
