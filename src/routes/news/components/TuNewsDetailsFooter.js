// @flow

import React from 'react'
import styled from 'styled-components'
import { TFunction } from 'i18next'

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 96%;
  background-color:  #007aa8;
  padding: 0 2% 5px;
  color: white;
  border-radius: 24px;
`

const StyledContainer = styled.div`
  padding: 5px 10px 0;
`

const StyledLink = styled.a`
  color: white;
  text-decoration: underline;
`

type PropsType = {|
  eNewsNumber: string,
  date: string,
  language: string,
  t: TFunction
|}

class TuNewsDetailsFooter extends React.PureComponent<PropsType> {
  render () {
    const { eNewsNumber, date, language, t } = this.props
    date.locale(language)
    const timestamp = date.format('LL')

    return (
      <Footer>
        <StyledContainer>{t('eNewsNo')}: {eNewsNumber}</StyledContainer>
        <StyledContainer>
          <StyledLink href='http://www.tunews.de' target='_blank'>
            {t('tunewsInternational')}
          </StyledLink>
        </StyledContainer>
        <StyledContainer>{timestamp}</StyledContainer>
      </Footer>
    )
  }
}

export default TuNewsDetailsFooter
