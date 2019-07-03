// @flow

import type { SetContentLanguageActionType } from '../../app/StoreActionType'

export default (language: string): SetContentLanguageActionType => ({
  type: 'SET_CONTENT_LANGUAGE',
  params: {
    contentLanguage: language
  }
})
