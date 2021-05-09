import { createAction } from "redux-actions";
import { Payload } from "api-client";
import type { PayloadDataType } from "../../../modules/app/PayloadDataType";
export type FinishFetchMoreActionType<T extends PayloadDataType> = {
  type: string;
  payload: Payload<T>;
};
export const finishFetchMoreActionName = (stateName: string): string => `FINISH_FETCH_MORE_${stateName.toUpperCase()}`;

const finishFetchAction = <T extends PayloadDataType>(stateName: string, payload: Payload<T>): FinishFetchMoreActionType<T> => createAction(finishFetchMoreActionName(stateName))(payload);

export default finishFetchAction;