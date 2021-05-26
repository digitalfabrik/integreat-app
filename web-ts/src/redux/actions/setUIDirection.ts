import { createAction } from 'redux-actions'

type UIDirectionType = 'ltr' | 'rtl'
export type SetUiDirectionActionType = {
  type: string
  payload: UIDirectionType
}
export default (direction: UIDirectionType): SetUiDirectionActionType =>
  createAction<UIDirectionType>('SET_UI_DIRECTION')(direction)
