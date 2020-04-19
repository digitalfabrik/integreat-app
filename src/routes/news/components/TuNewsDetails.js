// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import BreadCrumbs from '../../../modules/common/components/Breadcrumbs'
import TuNewsIcon from './../assets/tu-news-active.png'

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;
  height: 60px;
  background-color: rgba(0, 122, 168, 0.4);
  border-radius: 11px;
  overflow: hidden;
  position: relative;
`
const StyledBannerImage = styled.img`
max-height: 100%
`

const StyledTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #007aa8;
  font-size: 20px;
  font-weight: bold;
  color: white;
  width: 205px;
  height: 100%;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #6f6f6e;
  margin-bottom: 5px;
`
const Content = styled.p`
  font-size: 16px;
  line-height: 1.38;
  color: #6f6f6e;
`

type PropsType = {|
  title: string,
    message: string,
      timestamp: Moment,
        language: string,
          t: any
            |}

// This just a placeholder until the page design is ready
class TuNewsDetails extends React.PureComponent<PropsType> {
  render() {
    const { title, message, timestamp, language, t } = this.props
    return (
      <div>
        <StyledBanner>
          <StyledTitle>
            <StyledBannerImage src={TuNewsIcon} alt={t('tu.news')} />
          </StyledTitle>
        </StyledBanner>
        <Title>{title}</Title>
        <Content>{message}</Content>
      </div>
    )
  }
}

export default TuNewsDetails
