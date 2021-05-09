import { mount, shallow } from "enzyme";
import React from "react";
import { OfferModel } from "api-client";
import ConnectedOffersPage, { OffersPage } from "../OffersPage";
import theme from "../../../../modules/theme/constants/theme";
import createReduxStore from "../../../../modules/app/createReduxStore";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import createLocation from "../../../../createLocation";
import { OFFERS_ROUTE } from "../../../../modules/app/route-configs/OffersRouteConfig";
import CityModelBuilder from "api-client/src/testing/CityModelBuilder";
describe('OffersPage', () => {
  const city = 'augsburg';
  const language = 'de';
  const sprungbrettOffer = new OfferModel({
    alias: 'sprungbrett',
    path: 'path to fetch jobs from',
    title: 'Sprungbrett',
    thumbnail: 'xy',
    postData: null
  });
  const lehrstellenRadarPostData = new Map();
  lehrstellenRadarPostData.set('partner', '0006');
  lehrstellenRadarPostData.set('radius', '50');
  lehrstellenRadarPostData.set('plz', '86150');
  const offers = [sprungbrettOffer, new OfferModel({
    alias: 'ihk-lehrstellenboerse',
    path: 'ihk-jobborese.com',
    title: 'Jobboerse',
    thumbnail: 'xy',
    postData: lehrstellenRadarPostData
  }), new OfferModel({
    alias: 'ihk-praktikumsboerse',
    path: 'ihk-pratkitkumsboerse.com',
    title: 'Praktikumsboerse',
    thumbnail: 'xy',
    postData: null
  })];
  const cities = new CityModelBuilder(1).build();

  const t = (key: string | null | undefined): string => key || '';

  it('should render offer tiles if no offer is selected', () => {
    const offersPage = shallow(<OffersPage city={city} language={language} offers={offers} offerId={undefined} t={t} cities={cities} />);
    expect(offersPage).toMatchSnapshot();
  });
  it('should render a OfferNotFoundError if there is an offerId', () => {
    const offersPage = shallow(<OffersPage city={city} language={language} offers={offers} offerId='invalid_offer' t={t} cities={cities} />);
    expect(offersPage).toMatchSnapshot();
  });
  it('should map state to props', () => {
    const location = createLocation({
      type: OFFERS_ROUTE,
      payload: {
        language,
        city,
        offerId: 'invalid_offer'
      }
    });
    const store = createReduxStore();
    store.getState().location = location;
    const tree = mount(<ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedOffersPage offers={offers} cities={cities} />
        </Provider>
      </ThemeProvider>);
    expect(tree.find(OffersPage).props()).toMatchObject({
      language,
      city,
      offers,
      cities,
      offerId: 'invalid_offer'
    });
  });
});