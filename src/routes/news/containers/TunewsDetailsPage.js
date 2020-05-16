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
import NewsRedirectController from './NewsRedirectController'
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
  background-color: ${({ theme }) => (theme.colors.tunewsThemeColor)};
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  font-size: 20px;
  font-weight: 700;
`
const Title = styled.h2`
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: 700;
`
const Content = styled.p`
  font-size: 16px;
  line-height: 1.38;
`
type PropsType = {|
  tunewsElement: TunewsModel,
  language: string,
  path: string,
  city: string,
  t: TFunction
|}

export class TunewsDetailsPage extends React.PureComponent<PropsType> {
  render () {
    const { tunewsElement, language, path, city, t } = this.props

    if (!tunewsElement) {
      const error = new ContentNotFoundError({ type: 'tunewsItem', id: path, city, language })
      return <FailureSwitcher error={error} />
    }

    const { title, content, date, eNewsNo } = tunewsElement
    return (
      <NewsRedirectController>
        <StyledContainer>
          <StyledWrapper>
            <StyledBanner>
              <StyledTitle>
                <StyledBannerImage src={TunewsIcon} alt='' />
              </StyledTitle>
            </StyledBanner>
            <Title>{title}</Title>
            <Content>{content}</Content>
          </StyledWrapper>
          <TunewsDetailsFooter eNewsNo={eNewsNo} date={date} language={language} t={t} />
        </StyledContainer>
      </NewsRedirectController>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  path: state.location.pathname,
  city: state.location.payload.city
})

export default compose(
  connect<PropsType, *, *, *, *, *>(mapStateToProps),
  withTranslation('news')
)(TunewsDetailsPage)
