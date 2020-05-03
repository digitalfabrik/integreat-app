// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import { LocalNewsModel, CityModel } from '@integreat-app/integreat-api-client'
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { TUNEWS_LIST_ROUTE } from './../../../modules/app/route-configs/TuNewsListRouteConfig'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'

const StyledContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

type PropsType = {|
  localNewsDetails: LocalNewsModel,
  title: string,
  language: string,
  city: string,
  cities: Array<CityModel>,
  redirect: any,
|}

class LocalNewsDetailsPage extends React.PureComponent<PropsType> {

  componentDidMount() {

    const currentCity: any = this.props.cities.find(cityElement => cityElement._code === this.props.city) || {}

    if (!currentCity.pushNotificationsEnabled && !currentCity.tunewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: CATEGORIES_ROUTE })
    }
    else if (!currentCity.pushNotificationsEnabled && currentCity.tunewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: TUNEWS_LIST_ROUTE })
    }
  }

  render() {
    const { localNewsDetails, title, language } = this.props
    const localNewsItem = localNewsDetails[0]

    return (
      <Page title={localNewsItem._title} content="" language={language} lastUpdate={localNewsItem._timestamp}>
        {localNewsItem._message}
      </Page>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => (
  {
    language: state.location.payload.language,
    city: state.location.payload.city,
    cities: state.cities._data,
  }
)

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action))
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps, mapDispatchToProps),
  withTranslation('localNewsDetails')
)(LocalNewsDetailsPage)

