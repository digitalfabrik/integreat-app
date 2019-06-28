// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import SearchModal from '../components/SearchModal'
import { CategoriesMapModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateToCategory: NavigateToCategoryParamsType => void,
  language: string,
  cityCode: string,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }

  const { searchRoute, city } = state.cityContent

  return {
    categories: (searchRoute && searchRoute.categoriesMap) || null,
    language: state.contentLanguage,
    cityCode: city,
    closeModal: () => { ownProps.navigation.goBack() }
  }
}

type DispatchType = Dispatch<StoreActionType>
const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType) => {
  return {
    navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation)
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withTheme(props => props.language)(SearchModal)
)
