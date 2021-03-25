// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import RemoteContent from '../RemoteContent'
import { ThemeProvider } from 'styled-components'
import lightTheme from '../../../theme/constants/theme'

describe('RemoteContent', () => {
  it('should render', () => {
    expect(
      shallow(
        <RemoteContent dangerouslySetInnerHTML={{ __html: '<div> Test html </div>' }} onInternalLinkClick={() => {}} />
      )
    ).toMatchSnapshot()
  })

  it('should render and have centered props', () => {
    expect(
      shallow(
        <RemoteContent
          centered
          dangerouslySetInnerHTML={{ __html: '<div> Test html </div>' }}
          onInternalLinkClick={() => {}}
        />
      )
    ).toMatchSnapshot()
  })

  it('should trigger on internalLinkClick', () => {
    const path = '/augsburg/de'
    const href = `https://integreat.app${path}`
    const html = `<a href=${href}>Test Anchor</a>`
    const onInternalLinkClick = jest.fn()

    // Solution to test onClick event on dangerouslySetInnerHtml:
    // https://stackoverflow.com/a/64251522
    const body = document.getElementsByTagName('body')[0]
    const child = document.createElement('div')

    body.appendChild(child)

    mount(
      <ThemeProvider theme={lightTheme}>
        <RemoteContent dangerouslySetInnerHTML={{ __html: html }}
                       onInternalLinkClick={onInternalLinkClick}
        />
      </ThemeProvider>, { attachTo: child }
    )

    expect(document.querySelectorAll('a')).toHaveLength(1)
    const event = new Event('click')
    document.querySelector('a')?.dispatchEvent(event)

    expect(onInternalLinkClick).toHaveBeenCalledTimes(1)
    expect(onInternalLinkClick).toHaveBeenLastCalledWith(path)

    body.removeChild(child)
  })
})
