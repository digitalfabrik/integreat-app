import { cleanup, fireEvent, RenderResult } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import HeaderActionItemDropDown from '../HeaderActionItemDropDown'

describe('HeaderActionItemDropDown', () => {
  let wrapperComponent: RenderResult
  let inner: HTMLElement
  let outside: HTMLElement

  beforeEach(() => {
    const InnerComponent = ({ closeDropDown }: { closeDropDown: () => void }) => (
      <span onClick={closeDropDown}>Do you see me?</span>
    )

    wrapperComponent = renderWithTheme(
      <>
        <span>Click me to trigger dropdown!</span>
        <HeaderActionItemDropDown iconSrc='/someImg' text='some text'>
          {closeDropDown => <InnerComponent closeDropDown={closeDropDown} />}
        </HeaderActionItemDropDown>
      </>
    )

    inner = wrapperComponent.getByText('Do you see me?')
    outside = wrapperComponent.getByText('Click me to trigger dropdown!')
  })

  afterEach(() => {
    cleanup()
  })

  it('should open and close dropdown', () => {
    expect(inner).not.toBeVisible()

    const button = wrapperComponent.getByRole('button')
    fireEvent.click(button)

    expect(inner).toBeVisible()

    fireEvent.click(button)
    expect(wrapperComponent.queryByText('Do you see me?')).not.toBeVisible()
  })

  it('should close if clicked outside', async () => {
    const button = wrapperComponent.getByRole('button')
    fireEvent.click(button)
    expect(inner).toBeVisible()

    fireEvent.mouseDown(outside)

    expect(wrapperComponent.queryByText('Do you see me?')).not.toBeVisible()

    fireEvent.click(button)
    expect(inner).toBeVisible()
  })

  it('should close if inner component demands', async () => {
    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(inner).toBeVisible()
    fireEvent.click(inner)
    expect(inner).not.toBeVisible()
  })

  it('should close if pressing escape', async () => {
    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(inner).toBeVisible()
    fireEvent.keyDown(outside, { keyCode: 27 })
    expect(inner).not.toBeVisible()
  })

  it('should close if pressing enter', async () => {
    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(inner).toBeVisible()
    fireEvent.keyDown(outside, { keyCode: 13 })
    expect(inner).not.toBeVisible()
  })

  it('should be closed from the beginning', () => {
    expect(inner).not.toBeVisible()
  })
})
