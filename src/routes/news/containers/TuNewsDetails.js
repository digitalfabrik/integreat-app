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
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { TUNEWS_LIST_ROUTE } from './../../../modules/app/route-configs/TuNewsListRouteConfig'
import { CityModel } from '@integreat-app/integreat-api-client'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'
import { NEWS_ROUTE } from './../../../modules/app/route-configs/NewsRouteConfig'

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
  city: string,
  cities: Array<CityModel>,
  redirect: any,
  t: TFunction
|}

class TuNewsDetailsPage extends React.PureComponent<PropsType> {

  componentDidMount() {
    const currentCity: any = this.props.cities.find(cityElement => cityElement._code === this.props.city) || {}

    if (!currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: CATEGORIES_ROUTE })
    }
    else if (currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: NEWS_ROUTE })
    }
  }

  render() {
    const { tuNewsElementDetails, language, t } = this.props

    return (
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
        <TuNewsDetailsFooter eNewsNumber={tuNewsElementDetails.enewsno} date={tuNewsElementDetails && tuNewsElementDetails._date} language={language} t={this.props.t}/>
      </StyledContainer>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  cities: state.cities._data,
})

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action))
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps),
  withTranslation('tuNewsDetails')
)(TuNewsDetailsPage)
