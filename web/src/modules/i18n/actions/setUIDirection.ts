import { createAction } from "redux-actions";
export const setUiDirectionAction = 'SET_UI_DIRECTION';
export type SetUiDirectionActionType = {
  type: "SET_UI_DIRECTION";
  payload: "ltr" | "rtl";
};
export default ((direction: "ltr" | "rtl"): SetUiDirectionActionType => createAction('SET_UI_DIRECTION')(direction));