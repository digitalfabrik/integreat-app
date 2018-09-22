// @flow

import * as React from 'react'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import type { NavigationScreenProp, NavigationState } from 'react-navigation'
import { Categories } from '../components/Categories'
import CityModel from '../../../modules/endpoint/models/CityModel'
import TileModel from '../../../modules/common/models/TileModel'
import type { ThemeType } from 'modules/theme/constants/theme'
import { withTheme } from 'styled-components'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { DownloadedStateType, StateType } from '../../../modules/app/StateType'

type PropType = {
  navigation: NavigationScreenProp<NavigationState>,
  cities?: Array<CityModel>,
  categories?: CategoriesMapModel,
  language: string,
  theme: ThemeType,
  fetchCategories: (prioritisedLanguage: string, city: string) => void,
  fetchCities: (language: string) => void,
  files: DownloadedStateType,
  download_finished: boolean
}

class CategoriesContainer extends React.Component<PropType> {
  componentDidMount () {
    if (!this.props.cities) {
      this.props.fetchCities(this.props.language)
    }

    if (!this.props.categories) {
      this.props.fetchCategories(this.props.language, this.getCityParam())
    }
  }

  onTilePress = (tile: TileModel) => {
    this.navigate(tile.path)
  }

  onItemPress = (category: CategoryModel) => {
    this.navigate(category.path)
  }

  navigate = (path: string) => {
    const params = {
      path: path,
      city: this.getCityParam()
    }
    if (this.props.navigation.push) {
      this.props.navigation.push('Categories', params)
    }
  }

  getCityParam (): string {
    return this.props.navigation.getParam('city')
  }

  getCurrentPath (): string {
    const city = this.getCityParam()
    const language = this.props.language
    const path = this.props.navigation.getParam('path')
    if (!path) {
      return `/${city}/${language}`
    }

    return path
  }

  render () {
    const categories = this.props.categories
    const cities = this.props.cities
    if (!categories || !cities || !this.props.download_finished) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <Categories categories={categories} cities={cities}
                       language={this.props.language} city={this.getCityParam()}
                       path={this.getCurrentPath()}
                       onTilePress={this.onTilePress} onItemPress={this.onItemPress}
                       theme={this.props.theme} />
  }
}

const mapStateToProps = (state: StateType, ownProps) => {
  const targetCity = ownProps.navigation.getParam('city')

  const language = state.language
  const cities = state.cities.json
  const cityInState = state.categories.cities[targetCity]

  const notReadyProps = {
    language: language,
    cities: undefined,
    categories: undefined,
    download_finished: false,
    files: {}
  }

  if (!cities || !cityInState) {
    return notReadyProps
  }

  const json = cityInState.json[language]

  if (!json || !cityInState.download_finished) {
    return notReadyProps
  }

  return {
    language: language,
    cities: citiesEndpoint.mapResponse(cities),
    categories: categoriesEndpoint.mapResponse(json, {language, city: targetCity}),
    download_finished: true,
    files: cityInState.files
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    fetchCategories: (prioritisedLanguage: string, city: string) => dispatch({
      type: 'FETCH_CATEGORIES_REQUEST',
      params: {prioritisedLanguage, city},
      meta: {retry: true}
    }),
    fetchCities: (language: string) => dispatch({
      type: 'FETCH_CITIES_REQUEST',
      params: {language},
      meta: {retry: true}
    })
  }
}

// $FlowFixMe
export default withTheme(connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer))
