// @flow

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import RemoteContent from '../RemoteContent'
import { ThemeProvider } from 'styled-components'
import lightTheme from '../../../theme/constants/theme'

describe('RemoteContent', () => {
  it('should render the html content', () => {
    const content = 'Test html'
    const { getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <RemoteContent dangerouslySetInnerHTML={{ __html: `<div>${content}</div>` }}
                       onInternalLinkClick={() => {}} />
      </ThemeProvider>)
    expect(getByText(content)).toBeTruthy()
  })

  it('should trigger on internalLinkClick for internal links', () => {
    const path = '/augsburg/de'
    const href = `https://integreat.app${path}`
    const html = `<a href=${href}>Test Anchor</a>`
    const onInternalLinkClick = jest.fn()

    const { getByRole, getAllByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <RemoteContent dangerouslySetInnerHTML={{ __html: html }}
                       onInternalLinkClick={onInternalLinkClick}
        />
      </ThemeProvider>
    )

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(onInternalLinkClick).toHaveBeenCalledTimes(1)
    expect(onInternalLinkClick).toHaveBeenLastCalledWith(path)
  })

  it('should not trigger on internalLinkClick for external links', () => {
    const href = `https://some.external/link`
    const html = `<a href=${href}>Test Anchor</a>`
    const onInternalLinkClick = jest.fn()

    const { getByRole, getAllByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <RemoteContent dangerouslySetInnerHTML={{ __html: html }}
                       onInternalLinkClick={onInternalLinkClick}
        />
      </ThemeProvider>
    )

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(onInternalLinkClick).toHaveBeenCalledTimes(0)
  })
})
