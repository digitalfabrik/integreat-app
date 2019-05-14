// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { withTheme } from 'styled-components/native'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import SearchModal from '../components/SearchModal'

const mapStateToProps = (state: StateType, ownProps) => {
  return {
    categories: state.cityContent.categoriesMap,
    language: state.cityContent.language,
    cityCode: state.cityContent.city,
    closeModal: () => ownProps.navigation.goBack()
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => {
  return {
    navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation)
  }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(SearchModal))
