import React, { ReactElement } from 'react'
import styled from 'styled-components'
import dimensions from '../constants/dimensions'
import moment from 'moment'
import buildConfig from '../constants/buildConfig'
import { Link } from 'react-router-dom'

type PropsType = {
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
  }

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */

    & a {
      max-height: 75%;
    }
  }
`

/**
 * A logo component designed for the Header.
 */
export const HeaderLogo = ({ link }: PropsType): ReactElement => {
  const { campaign, appName, icons } = buildConfig()
  const currentDate = moment()
  const showCampaignLogo = campaign && currentDate.isAfter(campaign.startDate) && currentDate.isBefore(campaign.endDate)
  const src = campaign && showCampaignLogo ? campaign.campaignAppLogo : icons.appLogo

  return (
    <LogoContainer>
      <Link to={link}>
        <img src={src} alt={appName} />
      </Link>
    </LogoContainer>
  )
}

export default HeaderLogo
