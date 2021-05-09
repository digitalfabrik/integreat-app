import { CATEGORIES_ENDPOINT_NAME, CITIES_ENDPOINT_NAME, DISCLAIMER_ENDPOINT_NAME, EVENTS_ENDPOINT_NAME, OFFERS_ENDPOINT_NAME, LANGUAGES_ENDPOINT_NAME, LOCAL_NEWS_ELEMENT_ENDPOINT_NAME, LOCAL_NEWS_ENDPOINT_NAME, Payload, POIS_ENDPOINT_NAME, SPRUNGBRETT_JOBS_ENDPOINT_NAME, TUNEWS_ELEMENT_ENDPOINT_NAME, WOHNEN_ENDPOINT_NAME, TUNEWS_LANGUAGES_ENDPOINT_NAME } from "api-client";
import { handleActions } from "redux-actions";
import type { StartFetchActionType } from "../actions/startFetchAction";
import { startFetchActionName } from "../actions/startFetchAction";
import type { FinishFetchActionType } from "../actions/finishFetchAction";
import { finishFetchActionName } from "../actions/finishFetchAction";
import type { Reducer } from "redux";
import type { PayloadDataType } from "../PayloadDataType";

/**
 * Contains all endpoints which are defined in {@link './endpoints/'} and should be handled automatically by the reducer
 */
const endpointNames = [LANGUAGES_ENDPOINT_NAME, TUNEWS_LANGUAGES_ENDPOINT_NAME, CITIES_ENDPOINT_NAME, CATEGORIES_ENDPOINT_NAME, DISCLAIMER_ENDPOINT_NAME, EVENTS_ENDPOINT_NAME, LOCAL_NEWS_ENDPOINT_NAME, LOCAL_NEWS_ELEMENT_ENDPOINT_NAME, OFFERS_ENDPOINT_NAME, SPRUNGBRETT_JOBS_ENDPOINT_NAME, WOHNEN_ENDPOINT_NAME, POIS_ENDPOINT_NAME, TUNEWS_ELEMENT_ENDPOINT_NAME];
export const startFetchReducer = (oldPayload?: Payload<any>, action: StartFetchActionType<any>): Payload<any> => action.payload;
export const finishFetchReducer = <T extends PayloadDataType>(oldPayload?: Payload<T>, action: FinishFetchActionType<T, any>): Payload<T> => {
  if (!oldPayload) {
    return action.payload;
  }

  // Only stores the data if the requestUrl hasn't changed since the start of the fetching process.
  // For example the data of "Nürnberg" is very large and could take a while to load, in which time one could change to
  // another city, which data could be overridden then by the data from "Nürnberg"
  if (oldPayload.isFetching && oldPayload.requestUrl === action.payload.requestUrl) {
    return action.payload;
  } else {
    return oldPayload;
  }
};
const defaultState = new Payload(false);
type ReducerType<T extends PayloadDataType> = Reducer<Payload<T>, StartFetchActionType<T> | FinishFetchActionType<T>>;
const reducers: Record<string, ReducerType<any>> = endpointNames.reduce((result, endpointName) => {
  result[endpointName] = handleActions({
    [startFetchActionName(endpointName)]: startFetchReducer,
    [finishFetchActionName(endpointName)]: finishFetchReducer
  }, defaultState);
  return result;
}, {});
export default reducers;