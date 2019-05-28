// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { FetchLanguagesForCategoryActionType, StoreActionType } from '../../../modules/app/StoreActionType'
import { withTheme } from 'styled-components/native'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import SearchModal from '../components/SearchModal'
import { CategoriesMapModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateToCategory: (cityCode: string, language: string, path: string) => FetchLanguagesForCategoryActionType,
  language: string | null,
  cityCode: string | null,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  return {
    categories: state.cityContent.searchRoute.categoriesMap,
    language: state.cityContent.language,
    cityCode: state.cityContent.city,
    closeModal: () => { ownProps.navigation.goBack() }
  }
}

type DispatchType = Dispatch<StoreActionType>
const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType) => {
  return {
    navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation)
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, DispatchType>(mapStateToProps, mapDispatchToProps)(
  withTheme(SearchModal)
)
