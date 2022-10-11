import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { MAIN_DISCLAIMER_ROUTE } from 'api-client/src'

import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'
import Footer from './Footer'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.textColor};
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  border-bottom: 1px solid ${props => props.theme.colors.textColor};
  &:first-child {
    margin-top: -10px;
  }
  &:last-child {
    border-bottom: none;
  }
`

type PropsType = {
  language: string
}

const KebabFooter = ({ language }: PropsType): ReactElement => {
  const { aboutUrls, privacyUrls } = buildConfig()
  const { t } = useTranslation('layout')
  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default

  return (
    <Footer>
      <StyledLink to={privacyUrl}>{t('privacy')}</StyledLink>
      <StyledLink to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</StyledLink>
      <StyledLink to={RoutePatterns[MAIN_DISCLAIMER_ROUTE]}>{t('imprintAndContact')}</StyledLink>
    </Footer>
  )
}

export default KebabFooter
