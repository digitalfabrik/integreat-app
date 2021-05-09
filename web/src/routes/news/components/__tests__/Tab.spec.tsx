import React from "react";
import { shallow } from "enzyme";
import Tab from "../Tab";
import { TU_NEWS, LOCAL_NEWS } from "../../constants";
describe('Tab', () => {
  const active = true;
  const destination = '/testcity/en/news/local';

  const t = (key: string | null | undefined): string => key || '';

  it('should render the local news tab', () => {
    const wrapper = shallow(<Tab type={LOCAL_NEWS} active={active} destination={destination} t={t} />);
    expect(wrapper.find('Tab__StyledTab')).toHaveLength(1);
  });
  it('should render tunews tab', () => {
    const wrapper = shallow(<Tab type={TU_NEWS} active={active} destination='/testcity/en/news/tu-news' t={t} />);
    expect(wrapper.find('Tab__TuStyledTab')).toHaveLength(1);
  });
});