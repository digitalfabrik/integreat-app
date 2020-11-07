// @flow

import React from 'react'
import { mount } from 'enzyme'
import ClickOutsideHeaderDropDown, { DropDownContainer, HeaderActionItemDropDown } from '../HeaderActionItemDropDown'
import fileMock from '../../../../__mocks__/fileMock'
import lightTheme from '../../../theme/constants/theme'

describe('HeaderActionItemDropDown', () => {
  const MockNode = () => <div>Here comes the DropDown</div>
  let wrapperComponent

  beforeEach(() => {
    wrapperComponent = mount(<ClickOutsideHeaderDropDown theme={lightTheme} iconSrc='/someImg' text='some text'>
      <MockNode />
    </ClickOutsideHeaderDropDown>)
  })

  it('should pass correct closeDropDown callback', () => {
    const component = wrapperComponent.find(HeaderActionItemDropDown)
    const instance = component.instance()
    const callback = wrapperComponent.find('MockNode').prop('closeDropDownCallback')
    expect(callback).toEqual(instance?.closeDropDown)
  })

  describe('closeDropDown()', () => {
    it('should close DropDown if active', () => {
      const component = wrapperComponent.find(HeaderActionItemDropDown)
      component.setState({ dropDownActive: true })
      const instance: any = component.instance()
      instance.closeDropDown()
      expect(instance.state.dropDownActive).toBe(false)
    })

    it('shouldnt open DropDown if inactive', () => {
      const component = wrapperComponent.find(HeaderActionItemDropDown)
      const instance: any = component.instance()
      instance.closeDropDown()
      instance.closeDropDown()
      expect(instance.state.dropDownActive).toBe(false)
    })
  })

  describe('toggleDropDown()', () => {
    it('should close DropDown if active', () => {
      const component = wrapperComponent.find(HeaderActionItemDropDown)
      component.setState({ dropDownActive: true })
      const instance: any = component.instance()
      instance.toggleDropDown()
      expect(instance.state.dropDownActive).toBe(false)
    })

    it('should open DropDown if inactive', () => {
      const component = wrapperComponent.find(HeaderActionItemDropDown)
      const instance: any = component.instance()
      instance.toggleDropDown()
      expect(instance.state.dropDownActive).toBe(true)
    })
  })

  it('should toggle when user clicks on button', () => {
    const component = wrapperComponent.find(HeaderActionItemDropDown)
    const instance: any = component.instance()
    const onClick = component.find({ selector: 'button' }).prop('onClick')
    expect(onClick).toBe(instance.toggleDropDown)
  })

  it('should call closeDropDown when handleClickOutside is called', () => {
    const component = wrapperComponent.find(HeaderActionItemDropDown)
    const instance: any = component.instance()
    instance.closeDropDown = jest.fn()
    instance.handleClickOutside()
    expect(instance.closeDropDown).toHaveBeenCalled()
  })

  it('should be closed from the beginning', () => {
    const component = wrapperComponent.find(HeaderActionItemDropDown)
    const instance: any = component.instance()
    expect(instance.state.dropDownActive).toBe(false)
  })

  it('should add class if active', () => {
    const component = mount(<HeaderActionItemDropDown theme={lightTheme} iconSrc={fileMock}
                                                      text='some text'><MockNode /></HeaderActionItemDropDown>)
    expect(component.find(DropDownContainer).prop('active')).toBe(false)
    component.setState({ dropDownActive: true })
    expect(component.find(DropDownContainer).prop('active')).toBe(true)
  })
})
