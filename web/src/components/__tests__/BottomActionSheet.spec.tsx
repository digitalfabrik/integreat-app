import { act, fireEvent } from '@testing-library/react'
import React, { createRef } from 'react'

import { renderWithTheme } from '../../testing/render'
import BottomActionSheet, { ScrollableBottomSheetRef } from '../BottomActionSheet'

describe('BottomActionSheet', () => {
  it('exposes its scroll region as soon as the sheet mounts', () => {
    const ref = createRef<ScrollableBottomSheetRef>()

    renderWithTheme(
      <BottomActionSheet ref={ref} sibling={<div>Map controls</div>} title='Nearby places'>
        <div>Place list</div>
      </BottomActionSheet>,
    )

    expect(ref.current?.scrollElement).toBeInstanceOf(HTMLElement)
  })

  it('keeps the imperative height adapter used by the map', () => {
    const ref = createRef<ScrollableBottomSheetRef>()
    const { getByRole } = renderWithTheme(
      <BottomActionSheet ref={ref} sibling={<div>Map controls</div>} title='Nearby places'>
        <div>Place list</div>
      </BottomActionSheet>,
    )

    expect(getByRole('button', { name: 'common:handle' })).toHaveAttribute('aria-expanded', 'false')

    act(() => ref.current?.sheet?.snapTo(Number.MAX_SAFE_INTEGER))

    expect(getByRole('button', { name: 'common:handle' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps sibling map controls attached to the moving sheet surface', () => {
    const ref = createRef<ScrollableBottomSheetRef>()
    const { getByRole, getByText } = renderWithTheme(
      <BottomActionSheet ref={ref} sibling={<div>Map controls</div>} title='Nearby places'>
        <div>Place list</div>
      </BottomActionSheet>,
    )

    expect(getByRole('dialog')).toContainElement(getByText('Map controls'))
  })

  it('does not start sheet pointer handling from sibling controls', () => {
    const ref = createRef<ScrollableBottomSheetRef>()
    const { getByRole } = renderWithTheme(
      <BottomActionSheet ref={ref} sibling={<button type='button'>Zoom in</button>} title='Nearby places'>
        <div>Place list</div>
      </BottomActionSheet>,
    )
    const escapedPointerDown = jest.fn()
    window.addEventListener('pointerdown', escapedPointerDown, { once: true })

    fireEvent.pointerDown(getByRole('button', { name: 'Zoom in' }))
    window.removeEventListener('pointerdown', escapedPointerDown)

    expect(escapedPointerDown).not.toHaveBeenCalled()
  })
})
