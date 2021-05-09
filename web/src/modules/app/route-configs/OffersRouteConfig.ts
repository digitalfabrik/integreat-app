import type { AllPayloadsType } from "./RouteConfig";
import { RouteConfig } from "./RouteConfig";
import { CityModel, createCitiesEndpoint, createEventsEndpoint, createOffersEndpoint, createLanguagesEndpoint, OfferModel, Payload } from "api-client";
import type { Route } from "redux-first-router";
import fetchData from "../fetchData";
import { cmsApiBaseUrl } from "../constants/urls";
import type { StateType } from "../StateType";
type OffersRouteParamsType = {
  city: string;
  language: string;
};
type RequiredPayloadsType = {
  offers: Payload<Array<OfferModel>>;
  cities: Payload<Array<CityModel>>;
};
export const OFFERS_ROUTE = 'OFFERS';

/**
 * OffersRoute, matches /augsburg/de/offers and /augsburg/de/offers
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const offersRoute: Route = {
  path: '/:city/:language/offers/:offerId?',
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
    }), fetchData(createOffersEndpoint(cmsApiBaseUrl), dispatch, state.offers, {
      city,
      language
    })]);
  }
};

class OffersRouteConfig implements RouteConfig<OffersRouteParamsType, RequiredPayloadsType> {
  name = OFFERS_ROUTE;
  route = offersRoute;
  isLocationLayoutRoute = true;
  requiresHeader = true;
  requiresFooter = true;
  getRoutePath = ({
    city,
    language
  }: OffersRouteParamsType): string => `/${city}/${language}/offers`;
  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    cities: payloads.citiesPayload,
    offers: payloads.offersPayload
  });
  getLanguageChangePath = ({
    location,
    language
  }) => this.getRoutePath({
    city: location.payload.city,
    language
  });
  getPageTitle = ({
    t,
    payloads,
    location
  }) => {
    const cityModel = payloads.cities.data && payloads.cities.data.find(cityModel => cityModel.code === location.payload.city);

    if (!cityModel || !cityModel.offersEnabled) {
      return null;
    }

    return `${t('pageTitles.offers')} - ${cityModel.name}`;
  };
  getMetaDescription = () => null;
  getFeedbackTargetInformation = () => null;
}

export default OffersRouteConfig;