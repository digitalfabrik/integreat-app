// @flow
import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import TuNewsIcon from './../assets/tu-news-active.png'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { StateType } from '../../../modules/app/StateType'
import TuNewsDetailsFooter from './../components/TuNewsDetailsFooter'
import { TFunction } from 'i18next'
import NewsController from './../containers/NewsController'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

const StyledContainer = styled.div`
display: flex;
justify-content: space-between;
flex-direction: column;
`
const StyledWrapper = styled.div`
padding-bottom: 50px
`
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
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
  margin-bottom: 5px;
`
const Content = styled.p`
  font-size: 16px;
  line-height: 1.38;
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
`
type PropsType = {|
  tuNewsElementDetails: any,
  language: string,
  path: string,
  city: string,
  t: TFunction
|}

class TuNewsDetailsPage extends React.PureComponent<PropsType> {
  render() {
    const { tuNewsElementDetails, language, path, city, t } = this.props

    if (!tuNewsElementDetails) {
      const error = new ContentNotFoundError({ type: 'tuNewsItem', id: path, city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <NewsController>
        <StyledContainer>
          <StyledWrapper>
            <StyledBanner>
              <StyledTitle>
                <StyledBannerImage src={TuNewsIcon} alt={t('tu.news')} />
              </StyledTitle>
            </StyledBanner>
            <Title>{tuNewsElementDetails && tuNewsElementDetails._title}</Title>
            <Content>{tuNewsElementDetails && tuNewsElementDetails._content}</Content>
          </StyledWrapper>
          <TuNewsDetailsFooter eNewsNumber={tuNewsElementDetails.enewsno} date={tuNewsElementDetails && tuNewsElementDetails._date} language={language} t={this.props.t} />
        </StyledContainer>
      </NewsController>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  path: state.location.pathname,
  city: state.location.payload.city,
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps),
  withTranslation('tuNewsDetails')
)(TuNewsDetailsPage)
