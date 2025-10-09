import shouldForwardProp from '@emotion/is-prop-valid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { NewsType, TU_NEWS_TYPE, tunewsLabel } from 'shared'

import { TuNewsActiveIcon, TuNewsInactiveIcon } from '../assets'

const StyledTab = styled(Link, { shouldForwardProp })<{ tabSelected: boolean }>`
  display: flex;
  width: 160px;
  height: 48px;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  color: ${props => props.theme.palette.secondary.contrastText};
  object-fit: contain;
  background-color: ${props =>
    props.tabSelected ? props.theme.palette.secondary.main : props.theme.palette.text.disabled};
  border-radius: 12px;
  text-decoration: none;
`

const TuStyledTab = styled(StyledTab)`
  background-image: ${props => (props.tabSelected ? `url(${TuNewsActiveIcon})` : `url(${TuNewsInactiveIcon})`)};
  background-color: ${props =>
    props.tabSelected ? props.theme.palette.tunews.main : props.theme.palette.text.disabled};
  background-size: cover;
  background-position: center center;
`

type NewsTabProps = {
  type: NewsType
  active: boolean
  destination: string
}

const NewsTab = ({ type, active, destination }: NewsTabProps): ReactElement => {
  const { t } = useTranslation('news')
  if (type === TU_NEWS_TYPE) {
    return <TuStyledTab tabSelected={active} to={destination} aria-label={tunewsLabel} />
  }

  return (
    <StyledTab tabSelected={active} to={destination} aria-label={t('local')}>
      <Typography variant='title2'>{t('local').toUpperCase()}</Typography>
    </StyledTab>
  )
}

export default NewsTab
