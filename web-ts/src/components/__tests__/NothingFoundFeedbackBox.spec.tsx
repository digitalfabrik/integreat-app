import React from 'react'
import NothingFoundFeedbackBox from '../NothingFoundFeedbackBox'
import { shallow } from 'enzyme'
import TextButton from '../TextButton'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createFeedbackEndpoint: (_: string) => ({ request: () => {} })
}))

describe('NothingFoundFeedbackBox', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  it('should match snapshot', () => {
    expect(shallow(<NothingFoundFeedbackBox cityCode={cityCode} languageCode={languageCode} />)).toMatchSnapshot()
  })

  it('should show a thanks message after feedback was sent', () => {
    const component = shallow(<NothingFoundFeedbackBox cityCode={cityCode} languageCode={languageCode} />)
    const submitButton = component.find(TextButton)
    submitButton.simulate('click')

    expect(component).toMatchSnapshot()
  })
})
