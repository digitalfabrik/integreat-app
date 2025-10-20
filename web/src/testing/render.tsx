import { render, RenderResult } from '@testing-library/react'
import React, { ReactElement, ReactNode } from 'react'
import { createMemoryRouter, MemoryRouter, Route, RouterProvider, Routes } from 'react-router'

import ThemeContainer from '../components/ThemeContainer'
import { cityContentPattern, RoutePatterns, RouteType } from '../routes'

const AllTheProviders = ({ children, options }: { children: ReactNode; options?: { pathname: string } }) => (
  <MemoryRouter initialEntries={options ? [options.pathname] : ['/']}>
    <ThemeContainer contentDirection='ltr'>{children}</ThemeContainer>
  </MemoryRouter>
)

export const renderWithRouterAndTheme = (ui: ReactElement, options?: { pathname: string }): RenderResult =>
  render(ui, { wrapper: (props: { children: ReactNode }) => <AllTheProviders {...props} options={options} /> })

export const renderWithTheme = (ui: ReactElement): RenderResult =>
  render(<ThemeContainer contentDirection='ltr'>{ui}</ThemeContainer>)

export const renderWithRouter = (ui: ReactElement): RenderResult =>
  render(ui, {
    wrapper: (props: { children: ReactNode }) => <MemoryRouter>{props.children}</MemoryRouter>,
  })

type ExtendedRenderResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>
}

type RenderRouteOptions = {
  pathname: string
  routePattern: string
  searchParams?: string
  childPattern?: string
  previousRoutes?: { pathname: string; search?: string }[]
}

export const renderRoute = (ui: ReactElement, options: RenderRouteOptions): ExtendedRenderResult => {
  const routes = [
    {
      path: options.routePattern,
      element: ui,
      children: options.childPattern
        ? [
            {
              path: ':slug',
              element: null,
            },
          ]
        : [],
    },
  ]
  const router = createMemoryRouter(routes, {
    initialEntries: [...(options.previousRoutes ?? []), { pathname: options.pathname, search: options.searchParams }],
  })
  return {
    ...renderWithTheme(<RouterProvider router={router} />),
    router,
  }
}

type RenderAllRoutesOptions = {
  CityContentElement?: ReactElement
}

const DefaultRenderAllRoutesOptions: RenderAllRoutesOptions = {
  CityContentElement: undefined,
}

export const renderAllRoutes = (path: string, options = DefaultRenderAllRoutesOptions): RenderResult => {
  const DefaultElement = ({ route }: { route: string }) => <div>{route}</div>
  const { CityContentElement } = options

  const routes = Object.keys(RoutePatterns) as RouteType[]
  const baseRoutes = routes.filter(route => RoutePatterns[route].startsWith('/'))
  const cityContentRoutes = routes.filter(route => !RoutePatterns[route].startsWith('/'))

  return renderWithTheme(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        {baseRoutes.map(route => (
          <Route key={route} path={RoutePatterns[route]} element={<DefaultElement route={route} />} />
        ))}
        <Route
          path={cityContentPattern}
          element={
            <Routes>
              {cityContentRoutes.map(route => (
                <Route
                  key={route}
                  path={RoutePatterns[route]}
                  element={CityContentElement ?? <DefaultElement route={route} />}
                />
              ))}
            </Routes>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}
