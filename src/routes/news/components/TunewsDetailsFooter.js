// @flow

import React from 'react'
import styled from 'styled-components'
import { TFunction } from 'i18next'
import type Moment from 'moment'

const Footer = styled.footer`
  display: flex;
  width: 96%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.colors.secondaryAccentColor)};
  padding: 0 2% 5px;
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  border-radius: 24px;
`

const StyledContainer = styled.div`
  padding: 5px 10px 0;
`

const StyledLink = styled.a`
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  text-decoration: underline;
`

type PropsType = {|
  eNewsNumber: string,
  date: Moment,
  language: string,
  t: TFunction
|}

class TunewsDetailsFooter extends React.PureComponent<PropsType> {
  render () {
    const { eNewsNumber, date, language, t } = this.props
    date.locale(language)
    const timestamp = date.format('LL')

    return (
      <Footer>
        <StyledContainer>{t('eNewsNo')}: {eNewsNumber}</StyledContainer>
        <StyledContainer>
          <StyledLink href='http://www.tunews.de' target='_blank'>
            Tunews International
          </StyledLink>
        </StyledContainer>
        <StyledContainer>{timestamp}</StyledContainer>
      </Footer>
    )
  }
}

export default TunewsDetailsFooter
