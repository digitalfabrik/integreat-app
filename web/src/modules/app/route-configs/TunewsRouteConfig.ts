import { RouteConfig } from "./RouteConfig";
import type { Route } from "redux-first-router";
import { createCitiesEndpoint, createEventsEndpoint, createTunewsEndpoint, createTunewsLanguagesEndpoint, Payload, CityModel, createLanguagesEndpoint, LanguageModel } from "api-client";
import fetchData from "../fetchData";
import { cmsApiBaseUrl, tunewsApiBaseUrl } from "../constants/urls";
import type { StateType } from "../StateType";
import type { AllPayloadsType } from "./RouteConfig";
type TunewsRouteParamsType = {
  city: string;
  language: string;
};
// Loading tunews is handled inside Page
type RequiredPayloadsType = {
  cities: Payload<Array<CityModel>>;
  tunewsLanguages: Payload<Array<LanguageModel>>;
};
export const TUNEWS_ROUTE = 'TU_NEWS';
const tunewsRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState();
    const {
      city,
      language
    } = state.location.payload;
    await Promise.all([fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities), fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, {
      city,
      language
    }), fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, {
      city,
      language
    }), fetchData(createTunewsLanguagesEndpoint(tunewsApiBaseUrl), dispatch, state.languages, {
      city,
      language
    }), fetchData(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews.payload, {
      city,
      language,
      page: 1,
      count: 20
    })]);
  }
};

class TunewsRouteConfig implements RouteConfig<TunewsRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_ROUTE;
  route = tunewsRoute;
  isLocationLayoutRoute = true;
  requiresHeader = true;
  requiresFooter = true;
  getLanguageChangePath = ({
    location,
    language,
    payloads
  }) => {
    const tunewsLanguages = payloads.tunewsLanguages.data;

    if (tunewsLanguages && tunewsLanguages.find(languageModel => languageModel.code === language)) {
      return this.getRoutePath({
        city: location.payload.city,
        language
      });
    }

    return null;
  };
  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    cities: payloads.citiesPayload,
    tunewsLanguages: payloads.tunewsLanguagesPayload
  });
  getPageTitle = ({
    t,
    cityName,
    payloads,
    location
  }) => {
    if (!cityName) {
      return null;
    }

    const cityModel = payloads.cities.data && payloads.cities.data.find(cityModel => cityModel.code === location.payload.city);

    if (!cityModel || !cityModel.tunewsEnabled) {
      return null;
    }

    return `${t('pageTitles.tunews')} - ${cityName}`;
  };
  getRoutePath = ({
    city,
    language
  }: TunewsRouteParamsType): string => `/${city}/${language}/news/tu-news`;
  getMetaDescription = () => null;
  getFeedbackTargetInformation = () => null;
}

export default TunewsRouteConfig;