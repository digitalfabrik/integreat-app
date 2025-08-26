import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25
export const HEADER_TITLE_HEIGHT = 50

const HeaderTitleContainer = styled(Typography)`
  display: flex;
  align-items: flex-start;
  max-height: ${dimensions.headerHeightLarge};
  flex: 1;
  order: 2;
`

const titleStyles = ({ theme }: { theme: Theme }) => `
  display: flex;
  align-items: center;
  gap: 12px;

  ${theme.breakpoints.down('md')} {
    gap: 0;
  }
`

const StyledLink = styled(Link)`
  ${titleStyles}
`

const StyledTitle = styled('span')`
  ${titleStyles}
`

type HeaderTitleProps = {
  title: string
  landingPath: string
}

const HeaderTitle = ({ title, landingPath }: HeaderTitleProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { featureFlags } = buildConfig()
  const isFixedCity = featureFlags.fixedCity
  const variant = title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'

  if (isFixedCity) {
    return (
      <HeaderTitleContainer aria-label={t('changeLocation')} variant={variant}>
        <StyledTitle>{title}</StyledTitle>
      </HeaderTitleContainer>
    )
  }
  return (
    <HeaderTitleContainer variant={variant}>
      <Tooltip id='location' title={t('changeLocation')}>
        <StyledLink to={landingPath}>
          {title}
          <KeyboardArrowDownIcon />
        </StyledLink>
      </Tooltip>
    </HeaderTitleContainer>
  )
}

export default HeaderTitle
