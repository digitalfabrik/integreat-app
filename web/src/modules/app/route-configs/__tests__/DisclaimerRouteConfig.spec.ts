import { PageModel, Payload } from "api-client";
import moment from "moment";
import createLocation from "../../../../createLocation";
import DisclaimerRouteConfig from "../DisclaimerRouteConfig";
const disclaimer = new PageModel({
  path: '/disclaimer',
  title: 'Feedback, Kontakt und mögliches Engagement',
  content: 'this is a test content',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  hash: '2fe6283485a93932'
});
const disclaimerPayload = new Payload(false, 'https://random.api.json', disclaimer, null);
const payloads = {
  disclaimer: disclaimerPayload
};

const t = (key: string | null | undefined): string => key || '';

describe('DisclaimerRouteConfig', () => {
  const disclaimerRouteConfig = new DisclaimerRouteConfig();
  it('should get the right path', () => {
    expect(disclaimerRouteConfig.getRoutePath({
      city: 'augsburg',
      language: 'de'
    })).toBe('/augsburg/de/disclaimer');
  });
  it('should get the required payloads', () => {
    const allPayloads = {
      disclaimerPayload,
      citiesPayload: new Payload(false),
      eventsPayload: new Payload(true),
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      categoriesPayload: new Payload(true),
      offersPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    };
    expect(disclaimerRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads);
  });
  it('should get the right language change path', () => {
    const location = createLocation({
      payload: {
        city: 'augsburg',
        language: 'de'
      },
      pathname: '/augsburg/de/disclaimer',
      type: disclaimerRouteConfig.name
    });
    expect(disclaimerRouteConfig.getLanguageChangePath({
      payloads,
      language: 'en',
      location
    })).toBe('/augsburg/en/disclaimer');
    expect(disclaimerRouteConfig.getLanguageChangePath({
      payloads,
      language: 'fr',
      location
    })).toBe('/augsburg/fr/disclaimer');
  });
  it('should get the right page title', () => {
    const location = createLocation({
      payload: {
        city: 'augsburg',
        language: 'de'
      },
      pathname: '/augsburg/de/disclaimer',
      type: disclaimerRouteConfig.name
    });
    expect(disclaimerRouteConfig.getPageTitle({
      payloads,
      location,
      cityName: 'Augsburg',
      t
    })).toBe('pageTitles.disclaimer - Augsburg');
    expect(disclaimerRouteConfig.getPageTitle({
      payloads,
      location,
      cityName: null,
      t
    })).toBeNull();
  });
  it('should return the right meta description', () => {
    expect(disclaimerRouteConfig.getMetaDescription(t)).toBeNull();
  });
  describe('it should return the right feedback target information', () => {
    const location = createLocation({
      payload: {
        city: 'augsburg',
        language: 'de'
      },
      pathname: '/augsburg/de/disclaimer',
      type: disclaimerRouteConfig.name
    });
    expect(disclaimerRouteConfig.getFeedbackTargetInformation({
      payloads: {
        disclaimer: new Payload(false)
      },
      location
    })).toBeNull();
  });
});