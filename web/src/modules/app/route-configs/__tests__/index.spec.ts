import { getRouteConfig, routesMap } from "../index";
describe('Route Configs', () => {
  it('should return route configs', () => {
    expect(getRouteConfig('CATEGORIES')).toMatchSnapshot();
    expect(() => getRouteConfig('INVALID_NAME')).toThrowErrorMatchingSnapshot();
  });
  it('routesMap should match snapshot', () => {
    expect(routesMap).toMatchSnapshot();
  });
});