// @flow

import React from 'react'
import { mount } from 'enzyme'
import HeaderActionItemDropDown, { DropDownContainer } from '../HeaderActionItemDropDown'
import brightTheme from '../../../theme/constants/theme'
import { render, fireEvent } from '@testing-library/react'

describe('HeaderActionItemDropDown', () => {
  let MockNode
  let wrapperComponent

  beforeEach(() => {
    MockNode = () => <></>
    wrapperComponent = mount(
      <HeaderActionItemDropDown theme={brightTheme} iconSrc='/someImg' text='some text'>
        {closeDropDown => <MockNode closeDropDown={closeDropDown} />}
      </HeaderActionItemDropDown>)
  })

  it('should pass correct closeDropDown callback', () => {
    wrapperComponent.find('button').simulate('click')

    const callback = wrapperComponent.find('MockNode').prop('closeDropDownCallback')
    expect(callback).not.toBeNull()
  })

  it('should open DropDown if active', () => {
    wrapperComponent.find('button').simulate('click')

    expect(wrapperComponent.find(DropDownContainer)).toHaveLength(1)
  })

  it('shouldnt close DropDown if inactive', () => {
    wrapperComponent.find('button').simulate('click')
    wrapperComponent.find('button').simulate('click')
    expect(wrapperComponent.find(DropDownContainer)).toHaveLength(0)
  })

  it('should close if clicked outside', () => {
    const wrapperComponent = render(
      <div>
        <span>Click me to close dropdown!</span>
        <HeaderActionItemDropDown theme={brightTheme} iconSrc='/someImg' text='some text'>
          {() => <span>Do you see me?</span>}
        </HeaderActionItemDropDown>
      </div>
    )

    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(wrapperComponent.getByText('Do you see me?')).not.toBeNull()

    fireEvent.mouseDown(wrapperComponent.getByText('Click me to close dropdown!'))
    expect(wrapperComponent.queryByText('Do you see me?')).toBeNull()

    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(wrapperComponent.getByText('Do you see me?')).not.toBeNull()
  })

  it('should close if inner component demands', async () => {
    const MockNode = (props: {closeDropDown: () => void}) => {
      return <span onClick={props.closeDropDown}>Click Me!</span>
    }

    const wrapperComponent = render(
        <HeaderActionItemDropDown theme={brightTheme} iconSrc='/someImg' text='some text'>
          {closeDropDown => <MockNode closeDropDown={closeDropDown} />}
        </HeaderActionItemDropDown>
    )

    fireEvent.click(wrapperComponent.getByRole('button'))
    expect(wrapperComponent.getByText('Click Me!')).not.toBeNull()
    fireEvent.click(wrapperComponent.getByText('Click Me!'))
    expect(wrapperComponent.queryByText('Click Me!')).toBeNull()
  })

  it('should be closed from the beginning', () => {
    expect(wrapperComponent.find(DropDownContainer)).toHaveLength(0)
  })
})
