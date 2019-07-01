// @flow

import type { SetUiDirectionActionType } from '../../app/StoreActionType'

export type UiDirectionType = 'ltr' | 'rtl'

export default (direction: UiDirectionType): SetUiDirectionActionType => ({
  type: 'SET_UI_DIRECTION',
  params: {
    direction
  }
})
