import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import RemoteContent from '../RemoteContent'

const navigate = jest.fn()

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => navigate,
}))
jest.mock('react-i18next')

jest.mock('../../hooks/useWindowDimensions', () => jest.fn(() => ({})))

describe('RemoteContent', () => {
  window.open = jest.fn()

  beforeEach(jest.clearAllMocks)

  it('should render the html content', () => {
    const content = 'Test html'
    const { getByText } = renderWithTheme(<RemoteContent html={`<div>${content}</div>`} />)
    expect(getByText(content)).toBeTruthy()
  })

  it('should navigate for internal links', () => {
    const path = '/augsburg/de'
    const href = `https://integreat.app${path}`
    const html = `<a href=${href}>Test Anchor</a>`

    const { getByRole, getAllByRole } = renderWithTheme(<RemoteContent html={html} />)

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenLastCalledWith(path)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should open external links in a new tab', () => {
    const href = 'https://example.com/'
    const html = `<a href=${href} class="link-external">Test Anchor</a>`

    const { getByRole, getAllByRole } = renderWithTheme(<RemoteContent html={html} />)

    expect(getAllByRole('link')).toHaveLength(1)
    fireEvent.click(getByRole('link'))

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenLastCalledWith(href, '_blank', 'noreferrer')
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should block an iframe with unsupported source', () => {
    const src = `https://unknownvideo.com`
    const iframeTitle = 'unknown'
    const html = `<iframe title=${iframeTitle} src=${src} />`

    const { getByTitle } = renderWithTheme(<RemoteContent html={html} />)

    expect(getByTitle(iframeTitle)).toHaveAttribute('src', 'about:blank')
  })

  it('should show opt-in checkbox for supported iframe source', () => {
    const src = `https://vimeo.com`
    const iframeTitle = 'vimeo'
    const html = `<iframe title=${iframeTitle} src=${src} />`

    const { getAllByRole } = renderWithTheme(<RemoteContent html={html} />)

    expect(getAllByRole('checkbox')).toHaveLength(1)
  })

  it('should show iframe with correct source if opt-in checkbox was clicked', () => {
    const src = `https://vimeo.com`
    const doNotTrackParameter = `/?dnt=1`
    const iframeTitle = 'vimeo'
    const html = `<iframe title=${iframeTitle} src=${src} />`

    const { getByRole, getAllByRole, getByTitle } = renderWithTheme(<RemoteContent html={html} />)

    expect(getAllByRole('checkbox')).toHaveLength(1)
    fireEvent.click(getByRole('checkbox'))
    expect(getByTitle(iframeTitle)).toHaveAttribute('src', `${src}${doNotTrackParameter}`)
  })

  it('should sanitize the html', () => {
    const alertSpy = jest.spyOn(window, 'alert')
    const errorSpy = jest.spyOn(console, 'error')

    const content =
      '<div><p>Ich bleib aber da.<iframe//src=jAva&Tab;script:alert(3)>def</p><math><mi//xlink:href="data:x,<script>alert(4)</script>">'
    const { getByText } = renderWithTheme(<RemoteContent html={`<div>${content}</div>`} />)

    expect(alertSpy).not.toHaveBeenCalled()
    // window.alert is not implemented in jsdom and upon calling it an error message is logged to the console.
    // Therefore ensure no error message was logged
    expect(errorSpy).not.toHaveBeenCalled()
    expect(getByText('Ich bleib aber da.')).toBeTruthy()

    alertSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('should render contact card', () => {
    const testContent = 'Contact: test@example.com'
    const html = `<div class="contact-card">${testContent}</div>`
    const { getByText } = renderWithTheme(<RemoteContent html={html} />)
    expect(getByText(testContent)).toHaveClass('contact-card')
    expect(getByText(testContent)).toHaveStyle('background-color: rgb(127 127 127 / 15%)')
    expect(getByText(testContent)).toHaveStyle('background-image:')
    expect(getByText(testContent)).toHaveStyle('min-width: 72%')
  })
})
