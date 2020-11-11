// @flow

import React from 'react'
import HeaderActionItemDropDown from '../HeaderActionItemDropDown'
import { fireEvent, render, cleanup } from '@testing-library/react'
import lightTheme from '../../../theme/constants/theme'

describe('HeaderActionItemDropDown', () => {
  let wrapperComponent
  let inner

  beforeEach(() => {
    const InnerComponent = (props: { closeDropDown: () => void }) => {
      return <span onClick={props.closeDropDown}>Do you see me?</span>
    }

    wrapperComponent = render(
      <div>
        <span>Click me to trigger dropdown!</span>
        <HeaderActionItemDropDown theme={lightTheme} iconSrc='/someImg' text='some text'>
          {closeDropDown => <InnerComponent closeDropDown={closeDropDown} />}
        </HeaderActionItemDropDown>
      </div>
    )

    inner = wrapperComponent.getByText('Do you see me?')
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

    fireEvent.mouseDown(wrapperComponent.getByText('Click me to trigger dropdown!'))

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

  it('should be closed from the beginning', () => {
    expect(inner).not.toBeVisible()
  })
})
