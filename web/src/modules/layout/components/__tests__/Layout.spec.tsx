import React from "react";
import { shallow } from "enzyme";
import Layout from "../Layout";
describe('Layout', () => {
  it('should render all components', () => {
    const component = shallow(<Layout asideStickyTop={40} footer={<footer />} header={<header />} toolbar={<div>toolybar</div>}>
        <p>content right here</p>
      </Layout>);
    expect(component).toMatchSnapshot();
  });
});