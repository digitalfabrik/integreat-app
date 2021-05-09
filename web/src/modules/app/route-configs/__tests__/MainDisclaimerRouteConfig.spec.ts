import MainDisclaimerRouteConfig from "../MainDisclaimerRouteConfig";
import { Payload } from "api-client";
import createLocation from "../../../../createLocation";

const t = (key: string | null | undefined): string => key || '';

describe('MainDisclaimerRouteConfig', () => {
  const mainDisclaimerRouteConfig = new MainDisclaimerRouteConfig();
  it('should get the right path', () => {
    expect(mainDisclaimerRouteConfig.getRoutePath()).toBe('/disclaimer');
  });
  it('should get the required payloads', () => {
    const allPayloads = {
      categoriesPayload: new Payload(false),
      citiesPayload: new Payload(false),
      eventsPayload: new Payload(true),
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      offersPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    };
    expect(mainDisclaimerRouteConfig.getRequiredPayloads(allPayloads)).toEqual({});
  });
  it('should return the right page title', () => {
    const location = createLocation({
      payload: {},
      pathname: '/disclaimer',
      type: mainDisclaimerRouteConfig.name
    });
    expect(mainDisclaimerRouteConfig.getPageTitle({
      t,
      payloads: {},
      location,
      cityName: null
    })).toBe('pageTitles.mainDisclaimer');
  });
  it('should return the right meta description', () => {
    expect(mainDisclaimerRouteConfig.getMetaDescription(t)).toBeNull();
  });
  it('should return the right language change path', () => {
    const location = createLocation({
      payload: {
        language: 'de'
      },
      pathname: '/disclaimer',
      type: mainDisclaimerRouteConfig.name
    });
    expect(mainDisclaimerRouteConfig.getLanguageChangePath({
      payloads: {},
      location,
      language: 'de'
    })).toBeNull();
  });
  it('all functions should return the right feedback target information', () => {
    const location = createLocation({
      payload: {
        language: 'de'
      },
      pathname: '/disclaimer',
      type: mainDisclaimerRouteConfig.name
    });
    expect(mainDisclaimerRouteConfig.getFeedbackTargetInformation({
      payloads: {},
      location
    })).toBeNull();
  });
});