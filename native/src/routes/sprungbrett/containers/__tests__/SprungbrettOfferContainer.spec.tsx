import React from "react";
import { Provider } from "react-redux";
import createNavigationScreenPropMock from "../../../../testing/createNavigationPropMock";
import { SPRUNGBRETT_OFFER_ROUTE } from "api-client/src/routes";
import SprungbrettOfferContainer from "../SprungbrettOfferContainer";
import { render } from "@testing-library/react-native";
import { ErrorCode } from "../../../../modules/error/ErrorCodes";
import { useLoadFromEndpoint } from "../../../../modules/endpoint/hooks/useLoadFromEndpoint";
import configureMockStore from "redux-mock-store";
import CityModelBuilder from "api-client/src/testing/CityModelBuilder";
import { CityModel } from "api-client";
jest.mock('react-i18next');
jest.mock('../../../../modules/common/openExternalUrl');
jest.mock('../../../../modules/endpoint/hooks/useLoadFromEndpoint', () => ({
  useLoadFromEndpoint: jest.fn()
}));
jest.mock('../../components/SprungbrettOffer', () => {
  const Text = require('react-native').Text;

  return () => <Text>SprungbrettOffer</Text>;
});
jest.mock('../../../../modules/error/containers/FailureContainer', () => {
  const Text = require('react-native').Text;

  return ({
    code
  }: {
    code: string;
  }) => <Text>Failure {code}</Text>;
});
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const Text = require('react-native').Text;

  return ({
    refreshing
  }: {
    refreshing: boolean;
  }) => refreshing ? <Text>loading</Text> : null;
});
describe('SprungbrettOfferContainer', () => {
  const navigation = createNavigationScreenPropMock();
  const cityCode = 'augsburg';
  const languageCode = 'de';
  const route = {
    key: 'route-id-0',
    params: {
      cityCode,
      languageCode
    },
    name: SPRUNGBRETT_OFFER_ROUTE
  };
  const errorText = `Failure ${ErrorCode.UnknownError}`;

  const refresh = () => {};

  const cities = new CityModelBuilder(1).build();
  const state = {
    cities: {
      models: cities
    }
  };
  const mockStore = configureMockStore();
  const store = mockStore(state);

  const mockUseLoadFromEndpointOnce = mock => {
    // $FlowFixMe mockImplementationOnce is defined
    useLoadFromEndpoint.mockImplementationOnce(mock);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should display offers without a Loading spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: false,
      error: null,
      refresh
    }));
    const {
      getByText
    } = render(<Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>);
    expect(getByText('SprungbrettOffer')).toBeTruthy();
    expect(() => getByText('loading')).toThrow('Unable to find an element with text: loading');
    expect(() => getByText(errorText)).toThrow(`Unable to find an element with text: ${errorText}`);
  });
  it('should display offers with a Loading spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: true,
      error: null,
      refresh
    }));
    const {
      getByText
    } = render(<Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>);
    expect(getByText('SprungbrettOffer')).toBeTruthy();
    expect(getByText('loading')).toBeTruthy();
    expect(() => getByText(errorText)).toThrow(`Unable to find an element with text: ${errorText}`);
  });
  it('should display error without a loading spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: false,
      error: new Error('myError'),
      refresh
    }));
    const {
      getByText
    } = render(<Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>);
    expect(getByText(errorText)).toBeTruthy();
    expect(() => getByText('SprungbrettOffer')).toThrow('Unable to find an element with text: SprungbrettOffer');
    expect(() => getByText('loading')).toThrow('Unable to find an element with text: loading');
  });
  it('should display error with spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: true,
      error: new Error('myError'),
      refresh
    }));
    const {
      getByText
    } = render(<Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>);
    expect(getByText(errorText)).toBeTruthy();
    expect(getByText('loading')).toBeTruthy();
    expect(() => getByText('SprungbrettOffer')).toThrow('Unable to find an element with text: SprungbrettOffer');
  });
  it('should display a page not found error if offers disabled for city', () => {
    const disabledOffersCity = new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      offersEnabled: false,
      poisEnabled: true,
      pushNotificationsEnabled: true,
      tunewsEnabled: true,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {
        Konigsbrunn: {
          latitude: 48.267499,
          longitude: 10.889586
        }
      }
    });
    const store = mockStore({
      cities: {
        models: [disabledOffersCity]
      }
    });
    mockUseLoadFromEndpointOnce(() => ({
      data: null,
      loading: false,
      error: null,
      refresh
    }));
    const {
      getByText
    } = render(<Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>);
    expect(() => getByText('Offers')).toThrow('Unable to find an element with text: Offers');
    expect(() => getByText('loading')).toThrow('Unable to find an element with text: loading');
    expect(() => getByText(errorText)).toThrow(`Unable to find an element with text: ${errorText}`);
    expect(getByText(`Failure ${ErrorCode.PageNotFound}`)).toBeTruthy();
  });
});