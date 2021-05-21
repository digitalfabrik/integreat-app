import type { ActionType, ReduxReducer } from "redux-actions";
import { handleAction } from "redux-actions";
import setUIDirection from "../actions/setUIDirection";
export type DirectionStateType = "ltr" | "rtl";
const uiDirectionReducer: ReduxReducer<DirectionStateType, {
  type: "SET_UI_DIRECTION";
  payload: "ltr" | "rtl";
}> = handleAction('SET_UI_DIRECTION', (state: DirectionStateType, {
  payload
}: ActionType<typeof setUIDirection>) => payload, 'ltr');
export default uiDirectionReducer;