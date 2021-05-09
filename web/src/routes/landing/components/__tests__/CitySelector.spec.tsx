import React from "react";
import { shallow } from "enzyme";
import CitySelector from "../CitySelector";
import CityModelBuilder from "api-client/src/testing/CityModelBuilder";
describe('CitySelector', () => {
  const cities = new CityModelBuilder(5).build();
  it('should filter for existing and live cities', () => {
    const wrapper = shallow(<CitySelector filterText='' language='de' cities={cities} />);
    const component = wrapper.instance();
    const filteredCities = component.filter();
    expect(filteredCities).toHaveLength(3);
    expect(filteredCities.find(city => !city.live)).toBeUndefined();
  });
  it('should exclude location if location does not exist', () => {
    const wrapper = shallow(<CitySelector filterText='Does not exist' language='de' cities={cities} />);
    const component = wrapper.instance();
    expect(component.filter()).toHaveLength(0);
  });
  it('should exclude location if location is not live', () => {
    const wrapper = shallow(<CitySelector filterText='oldtown' language='de' cities={cities} />);
    const component = wrapper.instance();
    expect(component.filter()).toHaveLength(0);
  });
  it('should filter for all non-live cities if filterText is "wirschaffendas"', () => {
    const wrapper = shallow(<CitySelector filterText='wirschaffendas' language='de' cities={cities} />);
    const component = wrapper.instance();
    expect(component.filter()).toHaveLength(2);
  });
});