import React from "react";
import { shallow } from "enzyme";
import moment from "moment";
import DisclaimerPage from "../DisclaimerPage";
import { PageModel } from "api-client";
describe('DisclaimerPage', () => {
  const disclaimer = new PageModel({
    path: '/disclaimer',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment('2017-11-18T19:30:00.000Z'),
    hash: '2fe6283485a93932'
  });
  it('should match snapshot', () => {
    const wrapper = shallow(<DisclaimerPage disclaimer={disclaimer} />);
    expect(wrapper).toMatchSnapshot();
  });
});