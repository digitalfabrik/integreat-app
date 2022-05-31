import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import wrapWithTheme from '../../testing/wrapWithTheme'
import Collapsible from '../Collapsible'

describe('Collapsible', () => {
  const content = 'Some Content'
  const title = 'TestTitle'
  it('shows content by default', () => {
    const { getByText } = render(
      <Collapsible direction='ltr' title={title}>
        {content}
      </Collapsible>,
      { wrapper: wrapWithTheme }
    )
    expect(getByText(content)).toBeTruthy()
  })
  it('shows no content if initialCollapse is set to false', () => {
    const { queryByText } = render(
      <Collapsible direction='ltr' initialCollapsed={false} title={title}>
        {content}
      </Collapsible>,
      { wrapper: wrapWithTheme }
    )
    expect(queryByText(content)).toBeNull()
  })
  it('hides content by clicking on the header', () => {
    const { getByText, queryByText } = render(
      <Collapsible direction='ltr' title={title}>
        {content}
      </Collapsible>,
      {
        wrapper: wrapWithTheme
      }
    )
    expect(getByText(content)).toBeTruthy()
    fireEvent.click(getByText(title))
    expect(queryByText(content)).toBeNull()
  })
  it('shows content by clicking on the header if initialCollapse is set to false', () => {
    const { getByText, queryByText } = render(
      <Collapsible direction='ltr' initialCollapsed={false} title={title}>
        {content}
      </Collapsible>,
      {
        wrapper: wrapWithTheme
      }
    )
    expect(queryByText(content)).toBeNull()
    fireEvent.click(getByText(title))
    expect(getByText(content)).toBeTruthy()
  })
})
