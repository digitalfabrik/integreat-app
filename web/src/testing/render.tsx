import { render, RenderResult } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

// @ts-ignore IGAPP-833
export const renderWithRouter = (ui: ReactElement): RenderResult => render(ui, { wrapper: MemoryRouter })

export const renderWithBrowserRouter = (ui: ReactElement, { route = '/' } = {}): RenderResult => {
  window.history.pushState({}, 'Test page', route)

  return render(ui, { wrapper: BrowserRouter })
}
