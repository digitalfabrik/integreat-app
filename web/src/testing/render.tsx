import type { Router } from '@remix-run/router'
import { render, RenderResult } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../constants/buildConfig'

type RenderRouteOptions = {
  pathname: string
  routePattern: string
}

const AllTheProviders = ({ children, options }: { children: ReactElement; options?: { pathname: string } }) => (
  <MemoryRouter initialEntries={options ? [options.pathname] : ['/']}>
    <ThemeProvider theme={buildConfig().lightTheme}>{children}</ThemeProvider>
  </MemoryRouter>
)

export const renderWithRouterAndTheme = (ui: ReactElement, options?: { pathname: string }): RenderResult =>
  render(ui, { wrapper: (props: { children: ReactElement }) => <AllTheProviders {...props} options={options} /> })

export const renderWithTheme = (ui: ReactElement): RenderResult =>
  render(<ThemeProvider theme={buildConfig().lightTheme}>{ui}</ThemeProvider>)

export const renderWithRouter = (ui: ReactElement): RenderResult => render(ui, { wrapper: MemoryRouter })

type ExtendedRenderResult = RenderResult & {
  router: Router
}

export const renderRoute = (ui: ReactElement, options: RenderRouteOptions): ExtendedRenderResult => {
  const routes = [
    {
      path: options.routePattern,
      element: ui,
    },
  ]
  const router = createMemoryRouter(routes, { initialEntries: options.pathname ? [options.pathname] : ['/'] })
  return {
    ...renderWithTheme(<RouterProvider router={router} />),
    router,
  }
}
