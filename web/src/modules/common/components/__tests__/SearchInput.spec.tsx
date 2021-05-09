import React from "react";
import { mount, shallow } from "enzyme";
import ConnectedSearchInput, { SearchInput } from "../SearchInput";
import theme from "../../../theme/constants/theme";
import { ThemeProvider } from "styled-components";
describe('SearchInput', () => {
  it('should render', () => {
    expect(shallow(<SearchInput filterText='Test' placeholderText='Placeholder' onFilterTextChange={() => {}} />)).toMatchSnapshot();
  });
  it('should render and space search', () => {
    expect(shallow(<SearchInput filterText='Test' placeholderText='Placeholder' onFilterTextChange={() => {}} spaceSearch />)).toMatchSnapshot();
  });
  describe('connect', () => {
    it('should render', () => {
      expect(shallow(<ConnectedSearchInput filterText='Test' placeholderText='Placeholder' onFilterTextChange={() => {}} />)).toMatchSnapshot();
    });
  });
  it('should pass onFilterTextChange and onClickInput', () => {
    const outerFilterTextChange = jest.fn();
    const onClickInput = jest.fn();
    const component = mount(<ThemeProvider theme={theme}>
        <ConnectedSearchInput filterText='Test' placeholderText='Placeholder' onClickInput={onClickInput} onFilterTextChange={outerFilterTextChange} />
      </ThemeProvider>);
    component.find('input').simulate('click');
    expect(onClickInput).toHaveBeenCalled();
    component.find('input').simulate('change', {
      target: {
        value: 'test'
      }
    });
    expect(outerFilterTextChange).toHaveBeenCalledWith('test');
  });
});