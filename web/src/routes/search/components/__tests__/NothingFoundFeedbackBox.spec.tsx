import React from "react";
import { NothingFoundFeedbackBox } from "../NothingFoundFeedbackBox";
import { SEARCH_ROUTE } from "../../../../modules/app/route-configs/SearchRouteConfig";
import { shallow } from "enzyme";
import createLocation from "../../../../createLocation";
import TextButton from "../../../../modules/common/components/TextButton";
jest.mock('api-client', () => ({ ...jest.requireActual('api-client'),
  createFeedbackEndpoint: (baseUrl: string) => ({
    request: () => {}
  })
}));
describe('NothingFoundFeedbackBox', () => {
  const t = (key: string | null | undefined): string => key || '';

  const location = createLocation({
    type: SEARCH_ROUTE,
    payload: {
      city: 'augsburg',
      language: 'de'
    }
  });
  it('should match snapshot', () => {
    expect(shallow(<NothingFoundFeedbackBox location={location} t={t} />)).toMatchSnapshot();
  });
  it('should show a thanks message after feedback was sent', () => {
    const component = shallow(<NothingFoundFeedbackBox location={location} t={t} />);
    const submitButton = component.find(TextButton);
    submitButton.simulate('click');
    expect(component).toMatchSnapshot();
  });
});