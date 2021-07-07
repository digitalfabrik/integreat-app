import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import RemoteContent from '../RemoteContent'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

describe('RemoteContent', () => {
  it('should render the html content', () => {
    const content = 'Test html'
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <RemoteContent html={`<div>${content}</div>`} onInternalLinkClick={() => {}} />
      </ThemeProvider>
    )
    expect(getByText(content)).toBeTruthy()
  })

  it('should trigger on internalLinkClick for internal links', () => {
    const path = '/augsburg/de'
    const href = `https://integreat.app${path}`
    const html = `<a href=${href}>Test Anchor</a>`
    const onInternalLinkClick = jest.fn()

    const { getByRole, getAllByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />
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
      <ThemeProvider theme={buildConfig().lightTheme}>
        <RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />
      </ThemeProvider>
    )

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(onInternalLinkClick).toHaveBeenCalledTimes(0)
  })

  it('should sanitize the html', () => {
    const alertSpy = jest.spyOn(window, 'alert')
    const errorSpy = jest.spyOn(console, 'error')

    const content =
      '<div><p>Ich bleib aber da.<iframe//src=jAva&Tab;script:alert(3)>def</p><math><mi//xlink:href="data:x,<script>alert(4)</script>">'
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <RemoteContent html={`<div>${content}</div>`} onInternalLinkClick={() => {}} />
      </ThemeProvider>
    )

    expect(alertSpy).not.toHaveBeenCalled()
    // window.alert is not implemented in jsdom and upon calling it an error message is logged to the console.
    // Therefore ensure no error message was logged
    expect(errorSpy).not.toHaveBeenCalled()
    expect(getByText('Ich bleib aber da.')).toBeTruthy()

    alertSpy.mockRestore()
    errorSpy.mockRestore()
  })
})
