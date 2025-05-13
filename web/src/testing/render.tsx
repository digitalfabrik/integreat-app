import type { Router } from '@remix-run/router'
import { render, RenderResult } from '@testing-library/react'
import React, { ReactElement, ReactNode } from 'react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'

type RenderRouteOptions = {
  pathname: string
  routePattern: string
  searchParams?: string
  childPattern?: string
}

const theme = { ...buildConfig().legacyLightTheme, contentDirection: 'ltr' as UiDirectionType }

const AllTheProviders = ({ children, options }: { children: ReactNode; options?: { pathname: string } }) => (
  <MemoryRouter initialEntries={options ? [options.pathname] : ['/']}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </MemoryRouter>
)

export const renderWithRouterAndTheme = (ui: ReactElement, options?: { pathname: string }): RenderResult =>
  render(ui, { wrapper: (props: { children: ReactNode }) => <AllTheProviders {...props} options={options} /> })

export const renderWithTheme = (ui: ReactElement): RenderResult =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

export const renderWithRouter = (ui: ReactElement): RenderResult => render(ui, { wrapper: MemoryRouter })

type ExtendedRenderResult = RenderResult & {
  router: Router
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
    initialEntries: [{ pathname: options.pathname, search: options.searchParams }],
  })
  return {
    ...renderWithTheme(<RouterProvider router={router} />),
    router,
  }
}
