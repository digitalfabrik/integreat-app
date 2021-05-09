import React from "react";
import HeaderNavigationItem from "../HeaderNavigationItem";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "../../../theme/constants/theme";
import type { Node } from "react";
jest.mock('redux-first-router-link', () => ({
  children,
  to
}: {
  to: string;
  children: Array<Node>;
}) => <a href={to}>{children}</a>);
describe('HeaderNavigationItem', () => {
  const tooltip = 'random tooltip';
  const href = '/augsburg/de';
  const text = 'Kategorien';
  it('should render an ActiveNavigationItem', () => {
    const {
      getByText
    } = render(<ThemeProvider theme={theme}>
        <HeaderNavigationItem text={text} active href={href} icon='icon' />
      </ThemeProvider>);
    const textNode = getByText(text);
    expect(textNode).toBeTruthy();
    expect(() => getByText(tooltip)).toThrow();
  });
});