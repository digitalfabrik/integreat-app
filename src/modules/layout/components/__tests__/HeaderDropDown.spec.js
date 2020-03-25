// @flow

import React from 'react'
import { shallow } from 'enzyme'
import ClickOutsideHeaderDropDown, { DropDownContainer, HeaderDropDown } from '../HeaderDropDown'
import fileMock from '../../../../__mocks__/fileMock'

describe('HeaderDropDown', () => {
  const MockNode = () => <div>Here comes the DropDown</div>
  let wrapperComponent

  beforeEach(() => {
    wrapperComponent = shallow(<ClickOutsideHeaderDropDown iconSrc='/someImg' text='some text'>
      <MockNode />
    </ClickOutsideHeaderDropDown>)
  })

  it('should match snapshot', () => {
    expect(wrapperComponent.dive()).toMatchSnapshot()
  })

  it('should pass correct closeDropDown callback', () => {
    const component = wrapperComponent.dive()
    const instance: any = component.instance()
    expect(component.find('MockNode')).toHaveLength(1)
    const callback = component.find('MockNode').prop('closeDropDownCallback')
    expect(callback).toEqual(instance.closeDropDown)
  })

  describe('closeDropDown()', () => {
    it('should close DropDown if active', () => {
      const component = wrapperComponent.dive()
      component.setState({ dropDownActive: true })
      const instance: any = component.instance()
      instance.closeDropDown()
      expect(instance.state.dropDownActive).toBe(false)
    })

    it('shouldnt open DropDown if inactive', () => {
      const component = wrapperComponent.dive()
      const instance: any = component.instance()
      instance.closeDropDown()
      instance.closeDropDown()
      expect(instance.state.dropDownActive).toBe(false)
    })
  })

  describe('toggleDropDown()', () => {
    it('should close DropDown if active', () => {
      const component = wrapperComponent.dive()
      component.setState({ dropDownActive: true })
      const instance: any = component.instance()
      instance.toggleDropDown()
      expect(instance.state.dropDownActive).toBe(false)
    })

    it('should open DropDown if inactive', () => {
      const component = wrapperComponent.dive()
      const instance: any = component.instance()
      instance.toggleDropDown()
      expect(instance.state.dropDownActive).toBe(true)
    })
  })

  it('should toggle when user clicks on button', () => {
    const component = wrapperComponent.dive()
    const instance: any = component.instance()
    const onClick = component.find({ selector: 'button' }).prop('onClick')
    expect(onClick).toBe(instance.toggleDropDown)
  })

  it('should call closeDropDown when handleClickOutside is called', () => {
    const component = wrapperComponent.dive()
    const instance: any = component.instance()
    instance.closeDropDown = jest.fn()
    instance.handleClickOutside()
    expect(instance.closeDropDown).toHaveBeenCalled()
  })

  it('should be closed from the beginning', () => {
    const component = wrapperComponent.dive()
    const instance: any = component.instance()
    expect(instance.state.dropDownActive).toBe(false)
  })

  it('should add class if active', () => {
    const component = shallow(<HeaderDropDown iconSrc={fileMock} text='some text'><MockNode /></HeaderDropDown>)
    expect(component.find(DropDownContainer).prop('active')).toBe(false)
    component.setState({ dropDownActive: true })
    expect(component.find(DropDownContainer).prop('active')).toBe(true)
  })
})
