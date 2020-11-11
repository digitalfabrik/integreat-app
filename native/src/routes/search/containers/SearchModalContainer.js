// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import SearchModal from '../components/SearchModal'
import { CategoriesMapModel, createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from 'api-client'
import type { NavigationStackProp } from 'react-navigation-stack'
import { withTranslation } from 'react-i18next'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'

type OwnPropsType = {| navigation: NavigationStackProp<*> |}

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateToCategory: NavigateToCategoryParamsType => void,
  language: string,
  cityCode: string,
  closeModal: () => void,
  navigation: NavigationStackProp<*>,
  sendFeedback: (comment: string, query: string) => Promise<void>
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
    closeModal: () => { ownProps.navigation.goBack() },
    sendFeedback: async (comment: string, query: string) => {
      const apiUrlOverride = await determineApiUrl()
      await createFeedbackEndpoint(apiUrlOverride).request({
        feedbackType: SEARCH_FEEDBACK_TYPE,
        isPositiveRating: false,
        comment,
        city,
        language: state.contentLanguage,
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
  withTheme(
    withTranslation('search')(SearchModal)
  )
)
