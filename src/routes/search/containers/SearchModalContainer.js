// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import SearchModal from '../components/SearchModal'
import { CategoriesMapModel, createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import { baseUrl } from '../../../modules/endpoint/constants'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateToCategory: NavigateToCategoryParamsType => void,
  language: string | null,
  cityCode: string | null,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

const feedbackEndpoint = createFeedbackEndpoint(baseUrl)
console.log(feedbackEndpoint.stateName)

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  return {
    categories: state.cityContent.searchRoute.categoriesMap,
    language: state.cityContent.language,
    cityCode: state.cityContent.city,
    closeModal: () => { ownProps.navigation.goBack() },
    sendFeedback: async (comment: string, query: string) => {
      await feedbackEndpoint.request({
        feedbackType: SEARCH_FEEDBACK_TYPE,
        isPositiveRating: false,
        comment,
        city: state.cityContent.city,
        language: state.cityContent.language,
        query
      })
    }
  }
}

type DispatchType = Dispatch<StoreActionType>
const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType) => ({
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation)
})

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withTheme(props => props.language)(
    translate('search')(SearchModal)
  ))
