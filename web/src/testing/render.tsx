import { render, RenderResult } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../constants/buildConfig'

type RenderRouteOptions = {
  pathname: string
  wrapWithTheme?: boolean
  childRoute?: string
  routePattern: string
}

export const renderWithRouter = (
  ui: ReactElement,
  { wrapWithTheme = false, router = MemoryRouter } = {}
): RenderResult => {
  const wrapped = wrapWithTheme ? <ThemeProvider theme={buildConfig().lightTheme}>{ui}</ThemeProvider> : ui
  return render(wrapped, { wrapper: router })
}

export const renderWithBrowserRouter = (
  ui: ReactElement,
  { pathname = '/', wrapWithTheme = false } = {}
): RenderResult => {
  window.history.pushState({}, 'Test page', pathname)

  return renderWithRouter(ui, { wrapWithTheme, router: BrowserRouter })
}

export const renderRoute = (ui: ReactElement, options: RenderRouteOptions): RenderResult => {
  const { routePattern, childRoute } = options
  const wrapped = (
    <Routes>
      <Route path={routePattern} element={ui}>
        {childRoute && <Route path={childRoute} element={null} />}
      </Route>
    </Routes>
  )

  return renderWithBrowserRouter(wrapped, options)
}
