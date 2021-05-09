import React from "react";
import { mount } from "enzyme";
import moment from "moment";
import type Moment from "moment";
import configureMockStore from "redux-mock-store";
import ConnectedTunewsDetailsPage, { TunewsDetailsPage } from "../TunewsDetailsPage";
import { TunewsModel } from "api-client";
import { Provider } from "react-redux";
import createLocation from "../../../../createLocation";
import { TUNEWS_ROUTE } from "../../../../modules/app/route-configs/TunewsRouteConfig";
import theme from "../../../../modules/theme/constants/theme";
import { ThemeProvider } from "styled-components";
import CityModelBuilder from "api-client/src/testing/CityModelBuilder";
jest.mock('react-i18next');
jest.mock('redux-first-router-link');
describe('TunewsDetailsPage', () => {
  const cities = new CityModelBuilder(2).build();

  const createTunewsItemModel = (id, date: Moment): TunewsModel => new TunewsModel({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    eNewsNo: 'tun0000009902'
  });

  const tunewsElement = createTunewsItemModel(1, moment('2020-01-20T12:04:22.000Z'));
  const city = 'augsburg';
  const language = 'en';
  it('should map state to props', () => {
    const location = createLocation({
      payload: {
        city: city,
        language: language,
        id: 1
      },
      pathname: '/augsburg/en/news/tu-news/1',
      type: TUNEWS_ROUTE
    });
    const mockStore = configureMockStore();
    const store = mockStore({
      location: location,
      cities: {
        data: cities
      }
    });
    const tree = mount(<ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedTunewsDetailsPage tunewsElement={tunewsElement} />
        </Provider>
      </ThemeProvider>);
    expect(tree.find(TunewsDetailsPage).props()).toEqual({
      tunewsElement,
      language,
      id: 1,
      city,
      cities,
      dispatch: expect.any(Function)
    });
  });
});