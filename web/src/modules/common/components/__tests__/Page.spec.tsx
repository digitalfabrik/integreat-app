import React from "react";
import { shallow } from "enzyme";
import moment from "moment";
import Page from "../Page";
import DateFormatter from "api-client/src/i18n/DateFormatter";
jest.mock('react-i18next');
describe('Page', () => {
  const title = 'first Event';
  const lastUpdate = moment('2016-01-07T10:36:24.000Z');
  const content = 'content';
  const thumbnail = 'thumbnail';
  it('should render', () => {
    expect(shallow(<Page title={title} lastUpdate={lastUpdate} content={content} defaultThumbnailSrc={thumbnail} formatter={new DateFormatter('en')} onInternalLinkClick={() => {}} />)).toMatchSnapshot();
  });
});