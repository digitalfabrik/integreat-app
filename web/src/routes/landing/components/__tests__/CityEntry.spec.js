// @flow

import CityEntry from '../CityEntry'
import { shallow } from 'enzyme'
import React from 'react'
import lightTheme from '../../../../modules/theme/constants/theme'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

describe('CityEntry', () => {
  it('should match snapshot', () => {
    const city = new CityModelBuilder(1).build()[0]

    const component = shallow(<CityEntry theme={lightTheme} language='de' city={city} filterText='' />).dive()
    expect(component).toMatchSnapshot()
  })
})
