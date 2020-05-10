// @flow

import * as React from 'react'
import styled from 'styled-components'
import TunewsIcon from './../assets/TunewsActiveLogo.png'
import { withTranslation } from 'react-i18next'
import { TunewsModel } from '@integreat-app/integreat-api-client'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { StateType } from '../../../modules/app/StateType'
import TunewsDetailsFooter from '../components/TunewsDetailsFooter'
import { TFunction } from 'i18next'
import NewsController from './NewsController'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledWrapper = styled.div`
  padding-bottom: 50px;
`
const StyledBanner = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  margin: 25px 0;
  background-color: rgba(0, 122, 168, 0.4);
  border-radius: 11px;
`
const StyledBannerImage = styled.img`
  max-height: 100%;
`
const StyledTitle = styled.div`
  display: flex;
  width: 205px;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #007aa8;
  color: white;
  font-size: 20px;
  font-weight: 700;
`
const Title = styled.h2`
  margin-bottom: 5px;
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
  font-size: 24px;
  font-weight: 700;
`
const Content = styled.p`
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
  font-size: 16px;
  line-height: 1.38;
`
type PropsType = {|
  tunewsElementDetails: TunewsModel,
  language: string,
  path: string,
  city: string,
  t: TFunction
|}

export class TunewsDetailsPage extends React.PureComponent<PropsType> {
  render () {
    const { tunewsElementDetails, language, path, city, t } = this.props

    if (!tunewsElementDetails) {
      const error = new ContentNotFoundError({ type: 'tunewsItem', id: path, city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <NewsController>
        <StyledContainer>
          <StyledWrapper>
            <StyledBanner>
              <StyledTitle>
                <StyledBannerImage src={TunewsIcon} alt='' />
              </StyledTitle>
            </StyledBanner>
            <Title>{tunewsElementDetails && tunewsElementDetails.title}</Title>
            <Content>{tunewsElementDetails && tunewsElementDetails.content}</Content>
          </StyledWrapper>
          <TunewsDetailsFooter eNewsNumber={tunewsElementDetails.eNewsNo} date={tunewsElementDetails && tunewsElementDetails.date} language={language} t={t} />
        </StyledContainer>
      </NewsController>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  path: state.location.pathname,
  city: state.location.payload.city
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps),
  withTranslation('news')
)(TunewsDetailsPage)
