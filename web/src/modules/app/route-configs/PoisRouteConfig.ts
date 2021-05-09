import type { AllPayloadsType } from "./RouteConfig";
import { RouteConfig } from "./RouteConfig";
import type { Route } from "redux-first-router";
import fetchData from "../fetchData";
import { createCitiesEndpoint, createEventsEndpoint, createLanguagesEndpoint, createPOIsEndpoint, Payload, PoiModel } from "api-client";
import { cmsApiBaseUrl } from "../constants/urls";
import type { StateType } from "../StateType";
type PoisRouteParamsType = {
  city: string;
  language: string;
};
type RequiredPayloadsType = {
  pois: Payload<Array<PoiModel>>;
};
export const POIS_ROUTE = 'POI';
const poisRoute: Route = {
  path: '/:city/:language/locations/:poiId?',
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
    }), fetchData(createPOIsEndpoint(cmsApiBaseUrl), dispatch, state.pois, {
      city,
      language
    })]);
  }
};

class PoisRouteConfig implements RouteConfig<PoisRouteParamsType, RequiredPayloadsType> {
  name = POIS_ROUTE;
  route = poisRoute;
  isLocationLayoutRoute = true;
  requiresHeader = true;
  requiresFooter = true;
  getRoutePath = ({
    city,
    language
  }: PoisRouteParamsType): string => `/${city}/${language}/locations`;
  getLanguageChangePath = ({
    location,
    payloads,
    language
  }) => {
    const {
      city,
      poiId
    } = location.payload;
    const pois = payloads.pois.data;

    if (pois && poiId) {
      const poi = pois.find(_poi => _poi.path === location.pathname);
      return poi && poi.availableLanguages.get(language) || null;
    }

    return this.getRoutePath({
      city,
      language: language
    });
  };
  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    pois: payloads.poisPayload
  });
  getPageTitle = ({
    cityName,
    payloads,
    t,
    location
  }) => {
    if (!cityName) {
      return null;
    }

    const pathname = location.pathname;
    const pois = payloads.pois.data;
    const poi = pois && pois.find(poi => poi.path === pathname);
    return `${poi ? poi.title : t('pageTitles.pois')} - ${cityName}`;
  };
  getMetaDescription = () => null;
  getFeedbackTargetInformation = ({
    payloads,
    location
  }) => {
    const pois = payloads.pois.data;
    const poi = pois && pois.find(poi => poi.path === location.pathname);
    return poi ? {
      path: poi.path
    } : null;
  };
}

export default PoisRouteConfig;