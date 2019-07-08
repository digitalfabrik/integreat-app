// @flow

import type { SetContentLanguageActionType } from '../../app/StoreActionType'
import { handleAction, type ReduxReducer } from 'redux-actions'
import { DEFAULT_LANGUAGE } from '../components/I18nProvider'

const contentLanguageReducer: ReduxReducer<string, SetContentLanguageActionType> =
  handleAction(
    'SET_CONTENT_LANGUAGE',
    (state: string, action: SetContentLanguageActionType) => action.params.contentLanguage,
    DEFAULT_LANGUAGE
  )

export default contentLanguageReducer
