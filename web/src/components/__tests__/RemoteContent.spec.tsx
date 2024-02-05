import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import RemoteContent from '../RemoteContent'

jest.mock('react-i18next')

describe('RemoteContent', () => {
  it('should render the html content', () => {
    const content = 'Test html'
    const { getByText } = renderWithTheme(
      <RemoteContent html={`<div>${content}</div>`} onInternalLinkClick={() => undefined} />,
    )
    expect(getByText(content)).toBeTruthy()
  })

  it('should trigger on internalLinkClick for internal links', () => {
    const path = '/augsburg/de'
    const href = `https://integreat.app${path}`
    const html = `<a href=${href}>Test Anchor</a>`
    const onInternalLinkClick = jest.fn()

    const { getByRole, getAllByRole } = renderWithTheme(
      <RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />,
    )

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(onInternalLinkClick).toHaveBeenCalledTimes(1)
    expect(onInternalLinkClick).toHaveBeenLastCalledWith(path)
  })

  it('should not trigger on internalLinkClick for external links', () => {
    const href = `https://some.external/link`
    const html = `<a href=${href} class="link-external">Test Anchor</a>`
    const onInternalLinkClick = jest.fn()

    const { getByRole, getAllByRole } = renderWithTheme(
      <RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />,
    )

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(onInternalLinkClick).toHaveBeenCalledTimes(0)
  })

  it('should block an iframe with unsupported source', () => {
    const src = `https://unknownvideo.com`
    const iframeTitle = 'unknown'
    const html = `<iframe title=${iframeTitle} src=${src} />`
    const onInternalLinkClick = jest.fn()

    const { getByTitle } = renderWithTheme(<RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />)

    expect(getByTitle(iframeTitle)).toHaveAttribute('src', 'about:blank')
  })

  it('should show opt-in checkbox for supported iframe source', () => {
    const src = `https://vimeo.com`
    const iframeTitle = 'vimeo'
    const html = `<iframe title=${iframeTitle} src=${src} />`
    const onInternalLinkClick = jest.fn()

    const { getAllByRole } = renderWithTheme(<RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />)

    expect(getAllByRole('checkbox')).toHaveLength(1)
  })

  it('should show iframe with correct source if opt-in checkbox was clicked', () => {
    const src = `https://vimeo.com`
    const doNotTrackParameter = `/?dnt=1`
    const iframeTitle = 'vimeo'
    const html = `<iframe title=${iframeTitle} src=${src} />`
    const onInternalLinkClick = jest.fn()

    const { getByRole, getAllByRole, getByTitle } = renderWithTheme(
      <RemoteContent html={html} onInternalLinkClick={onInternalLinkClick} />,
    )

    expect(getAllByRole('checkbox')).toHaveLength(1)
    fireEvent.click(getByRole('checkbox'))
    expect(getByTitle(iframeTitle)).toHaveAttribute('src', `${src}${doNotTrackParameter}`)
  })

  it('should sanitize the html', () => {
    const alertSpy = jest.spyOn(window, 'alert')
    const errorSpy = jest.spyOn(console, 'error')

    const content =
      '<div><p>Ich bleib aber da.<iframe//src=jAva&Tab;script:alert(3)>def</p><math><mi//xlink:href="data:x,<script>alert(4)</script>">'
    const { getByText } = renderWithTheme(
      <RemoteContent html={`<div>${content}</div>`} onInternalLinkClick={() => undefined} />,
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
