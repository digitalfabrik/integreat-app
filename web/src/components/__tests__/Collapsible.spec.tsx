import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import Collapsible from '../Collapsible'

jest.mock('react-i18next')

describe('Collapsible', () => {
  const content = 'Some Content'
  const title = 'TestTitle'
  it('shows content by default', () => {
    const { getByText } = renderWithTheme(
      <Collapsible direction='ltr' title={title}>
        {content}
      </Collapsible>
    )
    expect(getByText(content)).toBeTruthy()
  })

  it('shows no content if initialCollapse is set to false', () => {
    const { queryByText } = renderWithTheme(
      <Collapsible direction='ltr' initialCollapsed={false} title={title}>
        {content}
      </Collapsible>
    )
    expect(queryByText(content)).toBeNull()
  })

  it('hides content by clicking on the header', () => {
    const { getByText, queryByText } = renderWithTheme(
      <Collapsible direction='ltr' title={title}>
        {content}
      </Collapsible>
    )
    expect(getByText(content)).toBeTruthy()
    fireEvent.click(getByText(title))
    expect(queryByText(content)).toBeNull()
  })

  it('shows content by clicking on the header if initialCollapse is set to false', () => {
    const { getByText, queryByText } = renderWithTheme(
      <Collapsible direction='ltr' initialCollapsed={false} title={title}>
        {content}
      </Collapsible>
    )
    expect(queryByText(content)).toBeNull()
    fireEvent.click(getByText(title))
    expect(getByText(content)).toBeTruthy()
  })
})
