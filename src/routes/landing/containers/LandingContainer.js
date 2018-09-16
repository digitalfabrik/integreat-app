// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { ActivityIndicator, ScrollView } from 'react-native'
import Heading from '../components/Heading'
import styled, { withTheme } from 'styled-components'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import type { ThemeType } from 'modules/theme/constants/theme'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import citiesEndpoint from 'modules/endpoint/endpoints/cities'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

const Wrapper = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 22px 10px 0;
`

type PropType = {
  language: string,
  cities?: Array<CityModel>,
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  theme: ThemeType,
  fetchCities: { language: string } => void
}

/**
 * This shows the landing screen. This is a container because it depends on endpoints.
 */
class LandingContainer extends React.Component<PropType> {
  componentDidMount () {
    if (!this.props.cities) {
      this.props.fetchCities({language: this.props.language})
    }
  }

  navigateToDashboard = cityModel => {
    this.props.navigation.navigate('Dashboard', {cityModel})
  }

  render () {
    return <Wrapper theme={this.props.theme}>
      <ScrollView>
        {!this.props.cities
          ? <ActivityIndicator size='large' color='#0000ff' />
          : <>
            <Heading />
            <FilterableCitySelector theme={this.props.theme} language={this.props.language} cities={this.props.cities}
                                    t={this.props.t}
                                    navigateToDashboard={this.navigateToDashboard} />
          </>
        }
      </ScrollView>
    </Wrapper>
  }
}

const mapStateToProps = (state: StateType) => {
  if (!state.data.cities.json) {
    return {}
  }
  return {language: state.language, cities: citiesEndpoint.mapResponse(state.data.cities.json)}
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    fetchCities: params => dispatch({type: 'FETCH_CITIES_REQUEST', params, meta: {retry: true}})
  }
}

// $FlowFixMe
export default withTheme(translate('landing')(connect(mapStateToProps, mapDispatchToProps)(LandingContainer)))
