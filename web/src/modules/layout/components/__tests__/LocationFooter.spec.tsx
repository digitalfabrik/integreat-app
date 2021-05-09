import { shallow } from "enzyme";
import React from "react";
import { LocationFooter } from "../LocationFooter";
describe('LocationFooter', () => {
  const t = (key: string | null | undefined): string => key || '';

  it('should match snapshot', () => {
    const onClick = () => {};

    expect(shallow(<LocationFooter city='augsburg' language='de' onClick={onClick} t={t} />)).toMatchSnapshot();
  });
});