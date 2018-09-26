// @flow

import { createAction } from 'redux-actions'
import type { SetLanguageActionType } from '../../app/StoreActionType'

export default (language: string): SetLanguageActionType => createAction('SET_LANGUAGE')(language)
