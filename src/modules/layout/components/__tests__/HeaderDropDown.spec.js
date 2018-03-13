import React from 'react'
import { shallow } from 'enzyme'
import HeaderDropDown from '../HeaderDropDown'

describe('HeaderDropDown', () => {
  const MockNode = () => <div>Here comes the DropDown</div>
  let wrapperComponent

  beforeEach(() => {
    wrapperComponent = shallow(<HeaderDropDown iconSrc='/someImg'>
      <MockNode />
    </HeaderDropDown>)
  })

  it('should match snapshot', () => {
    expect(wrapperComponent.dive()).toMatchSnapshot()
  })

  it('should pass correct closeDropDown callback', () => {
    const component = wrapperComponent.dive()
    expect(component.find('MockNode')).toHaveLength(1)
    const callback = component.find('MockNode').prop('closeDropDownCallback')
    expect(callback).toEqual(component.instance().closeDropDown)
  })

  describe('closeDropDown()', () => {
    it('should close DropDown if active', () => {
      const component = wrapperComponent.dive()
      component.setState({dropDownActive: true})
      component.instance().closeDropDown()
      expect(component.instance().state.dropDownActive).toBe(false)
    })

    it('shouldnt open DropDown if inactive', () => {
      const component = wrapperComponent.dive()
      component.instance().closeDropDown()
      expect(component.instance().state.dropDownActive).toBe(false)
    })
  })

  describe('toggleDropDown()', () => {
    it('should close DropDown if active', () => {
      const component = wrapperComponent.dive()
      component.setState({dropDownActive: true})
      component.instance().toggleDropDown()
      expect(component.instance().state.dropDownActive).toBe(false)
    })

    it('should open DropDown if inactive', () => {
      const component = wrapperComponent.dive()
      component.instance().toggleDropDown()
      expect(component.instance().state.dropDownActive).toBe(true)
    })
  })

  it('should toggle when user clicks on img', () => {
    const component = wrapperComponent.dive()
    const onClick = component.find('img').prop('onClick')
    expect(onClick).toBe(component.instance().toggleDropDown)
  })

  it('should call closeDropDown when handleClickOutside is called', () => {
    const component = wrapperComponent.dive()
    component.instance().closeDropDown = jest.fn()
    component.instance().handleClickOutside()
    expect(component.instance().closeDropDown).toHaveBeenCalled()
  })

  it('should be closed from the beginning', () => {
    expect(wrapperComponent.dive().instance().state.dropDownActive).toBe(false)
  })

  it('should add class if active', () => {
    const component = wrapperComponent.dive()
    expect(component.find('.dropDown').hasClass('dropDownActive')).toEqual(false)
    component.setState({dropDownActive: true})
    expect(component.find('.dropDown').hasClass('dropDownActive')).toEqual(true)
  })
})
