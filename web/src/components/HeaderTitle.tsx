import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25
export const HEADER_TITLE_HEIGHT = 50

const HeaderTitleContainer = styled(Typography)<{ withPadding?: boolean }>`
  display: flex;
  align-items: flex-start;
  max-height: ${dimensions.headerHeightLarge};
  flex: 1;
  order: 2;

  ${props => props.withPadding && props.theme.breakpoints.up('md')} {
    padding-bottom: 8px;
  }
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;

  ${props => props.theme.breakpoints.down('md')} {
    gap: 0;
  }
`

type HeaderTitleProps = {
  title: string
  landingPath: string
}

const HeaderTitle = ({ title, landingPath }: HeaderTitleProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { appName, featureFlags } = buildConfig()
  const isFixedCity = !featureFlags.fixedCity
  const integreatConfigs = ['Integreat', 'IntegreatTestCms']
  const isIntegreat = integreatConfigs.includes(appName)

  if (isFixedCity) {
    return (
      <HeaderTitleContainer
        withPadding={isIntegreat}
        aria-label={t('changeLocation')}
        variant={title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'}>
        <Tooltip id='location' title={t('changeLocation')}>
          <StyledLink to={landingPath}>
            {title}
            <KeyboardArrowDownIcon />
          </StyledLink>
        </Tooltip>
      </HeaderTitleContainer>
    )
  }

  return (
    <HeaderTitleContainer
      aria-label={t('changeLocation')}
      variant={title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'}>
      <StyledLink to={landingPath}>{title}</StyledLink>
    </HeaderTitleContainer>
  )
}

export default HeaderTitle
