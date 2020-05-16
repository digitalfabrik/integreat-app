// @flow

import React from 'react'
import styled from 'styled-components'
import { TFunction } from 'i18next'
import type Moment from 'moment'
import LastUpdateInfo from '../../../modules/common/components/LastUpdateInfo'

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.colors.tunewsThemeColor)};
  padding: 5px 0;
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  border-radius: 24px;
`

const StyledContainer = styled.div`
  padding: 0 10px;
`

const StyledLink = styled.a`
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  text-decoration: underline;
`
const CustomLastUpdateInfo = styled(LastUpdateInfo)`
  padding: 0 10px;
  color: ${({ theme }) => (theme.colors.backgroundColor)};

  &&& {
    margin: 0
  }
`

type PropsType = {|
  eNewsNo: string,
  date: Moment,
  language: string,
  t: TFunction
|}

class TunewsDetailsFooter extends React.PureComponent<PropsType> {
  render () {
    const { eNewsNo, date, language, t } = this.props

    return (
      <Footer>
        <StyledContainer>{t('eNewsNo')}: {eNewsNo}</StyledContainer>
        <StyledContainer>
          <StyledLink href='https://tunewsinternational.com' target='_blank'>
            tünews INTERNATIONAL
          </StyledLink>
        </StyledContainer>
        <CustomLastUpdateInfo lastUpdate={date} language={language} />
      </Footer>
    )
  }
}

export default TunewsDetailsFooter
