import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import Collapsible from '../Collapsible'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('Collapsible', () => {
  const content = 'Some Content'
  const title = 'TestTitle'

  it('shows content by default', () => {
    const { getByText } = renderWithTheme(<Collapsible title={title}>{content}</Collapsible>)
    expect(getByText(content)).toBeTruthy()
  })

  it('shows no content if default collapse is set to true', () => {
    const { getByText } = renderWithTheme(
      <Collapsible title={title} defaultCollapsed>
        {content}
      </Collapsible>,
    )
    expect(getByText(content)).not.toBeVisible()
  })

  it('hides content by clicking on the header', async () => {
    const { getByText } = renderWithTheme(<Collapsible title={title}>{content}</Collapsible>)
    expect(getByText(content)).toBeVisible()
    fireEvent.click(getByText(title))
    await waitFor(() => expect(getByText(content)).not.toBeVisible())
  })

  it('shows content by clicking on the header if initialCollapse is set to true', async () => {
    const { getByText } = renderWithTheme(
      <Collapsible defaultCollapsed title={title}>
        {content}
      </Collapsible>,
    )
    expect(getByText(content)).not.toBeVisible()
    fireEvent.click(getByText(title))
    await waitFor(() => expect(getByText(content)).toBeVisible())
  })
})
