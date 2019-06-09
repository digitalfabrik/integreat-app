// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import LanguageNotAvailablePage from '../../../modules/common/components/LanguageNotAvailablePage'
import withTheme from '../../theme/hocs/withTheme'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'
import createNavigateToCategory from '../../app/createNavigateToCategory'

const mapStateToProps = (state: StateType) => {
  const languages = state.cityContent.languages
  if (!languages) {
    throw new Error('languages have not been set.')
  }

  return {
    city: state.cityContent.city,
    languages
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => {
  return {
    changeLanguage: (city: string, newLanguage: string) => {
      const switchContentLanguage: SwitchContentLanguageActionType = {
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          city,
          newLanguage
        }
      }
      dispatch(switchContentLanguage)
      createNavigateToCategory('Dashboard', dispatch, ownProps.navigation)({
        cityCode: city,
        language: newLanguage,
        path: `/${city}/${newLanguage}`,
        forceUpdate: false,
        key: ownProps.navigation.getParam('key')
      })
    }
  }
}

export default compose([
  connect(mapStateToProps, mapDispatchToProps),
  withTheme(),
  translate('common')
])(LanguageNotAvailablePage)
