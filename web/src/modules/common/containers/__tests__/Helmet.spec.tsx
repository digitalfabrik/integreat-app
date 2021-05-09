import React from "react";
import { shallow } from "enzyme";
import Helmet from "../Helmet";
import { CityModel } from "api-client";
describe('Helmet', () => {
  const liveCity = new CityModel({
    name: 'Augsburg',
    code: 'augsburg',
    live: true,
    eventsEnabled: true,
    offersEnabled: true,
    tunewsEnabled: false,
    poisEnabled: true,
    pushNotificationsEnabled: false,
    sortingName: 'augsburg',
    prefix: 'Stadt',
    latitude: null,
    longitude: null,
    aliases: null
  });
  const hiddenCity = new CityModel({
    name: 'Testinstanz',
    code: 'testinstanz',
    live: false,
    eventsEnabled: true,
    offersEnabled: true,
    tunewsEnabled: false,
    poisEnabled: false,
    pushNotificationsEnabled: false,
    sortingName: 'Testinstanz',
    prefix: 'Stadt',
    latitude: null,
    longitude: null,
    aliases: null
  });
  const languageChangePaths = [{
    code: 'de',
    name: 'Deutsch',
    path: '/augsburg/de'
  }, {
    code: 'en',
    name: 'English',
    path: '/augsburg/en'
  }, {
    code: 'ar',
    name: 'Arabic',
    path: '/augsburg/ar'
  }];
  const inactiveLanguageChangePaths = [{
    code: 'de',
    name: 'Deutsch',
    path: '/testinstanz/de'
  }, {
    code: 'en',
    name: 'English',
    path: '/testinstanz/en'
  }, {
    code: 'ar',
    name: 'Arabic',
    path: '/testinstanz/ar'
  }];
  const pageTitle = 'PageTitle';
  const metaDescription = 'MetaDescription';
  it('should render and match snapshot', () => {
    const helmet = shallow(<Helmet pageTitle={pageTitle} metaDescription={metaDescription} languageChangePaths={languageChangePaths} cityModel={liveCity} />);
    expect(helmet).toMatchSnapshot();
  });
  it('should add noindex tag, if city is not live', () => {
    const helmet = shallow(<Helmet pageTitle={pageTitle} metaDescription={null} languageChangePaths={inactiveLanguageChangePaths} cityModel={hiddenCity} />);
    expect(helmet).toMatchSnapshot();
  });
});