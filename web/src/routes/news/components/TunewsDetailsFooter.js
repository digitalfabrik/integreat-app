// @flow

import React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import LastUpdateInfo from '../../../modules/common/components/LastUpdateInfo'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

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
  formatter: DateFormatter
|}

class TunewsDetailsFooter extends React.PureComponent<PropsType> {
  render () {
    const { eNewsNo, date, formatter } = this.props

    return (
      <Footer>
        <StyledContainer>{eNewsNo}</StyledContainer>
        <StyledContainer>
          <StyledLink href='https://tunewsinternational.com'>
            tünews INTERNATIONAL
          </StyledLink>
        </StyledContainer>
        <CustomLastUpdateInfo lastUpdate={date} formatter={formatter} />
      </Footer>
    )
  }
}

export default TunewsDetailsFooter
