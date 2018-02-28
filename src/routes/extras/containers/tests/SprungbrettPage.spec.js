import { shallow, mount } from 'enzyme'
import React from 'react'
import ConnectedSprungbrettPage, { SprungbrettPage } from '../SprungbrettPage'
import SprungbrettJobModel from '../../../../modules/endpoint/models/SprungbrettJobModel'
import EndpointBuilder from '../../../../modules/endpoint/EndpointBuilder'
import createHistory from '../../../../modules/app/createHistory'
import createReduxStore from '../../../../modules/app/createReduxStore'
import EndpointProvider from '../../../../modules/endpoint/EndpointProvider'
import { Provider } from 'react-redux'
import LanguageModel from '../../../../modules/endpoint/models/LanguageModel'

describe('SprungbrettPage', () => {
  const location = 'augsburg'
  const language = 'de'

  const jobs = [
    new SprungbrettJobModel({
      id: '0', title: 'WebDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: true
    }),
    new SprungbrettJobModel({
      id: '1', title: 'BackendDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: false
    }),
    new SprungbrettJobModel({
      id: '2', title: 'Freelancer', location: 'Augsburg', isEmployment: false, isApprenticeship: true
    })
  ]

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch')
  ]

  it('it should render a Failure if type is not valid', () => {
    const component = shallow(
      <SprungbrettPage setLanguageChangeUrls={() => {}}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'bla'} />
    )
    expect(component).toMatchSnapshot()
  })

  it('it should render a selector and a list if type is valid', () => {
    const component = shallow(
      <SprungbrettPage setLanguageChangeUrls={() => {}}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'all'} />
    )
    expect(component).toMatchSnapshot()
  })

  it('it should return all jobs', () => {
    const sprungbrettPage = shallow(
      <SprungbrettPage setLanguageChangeUrls={() => {}}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'all'} />
    ).instance()
    expect(sprungbrettPage.getJobs()).toEqual(jobs)
  })

  it('it should return jobs in which an apprenticeship is possible', () => {
    const sprungbrettPage = shallow(
      <SprungbrettPage setLanguageChangeUrls={() => {}}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'apprenticeships'} />
    ).instance()
    expect(sprungbrettPage.getJobs()).toEqual([jobs[0], jobs[2]])
  })

  it('it should return jobs in which an employment is possible', () => {
    const sprungbrettPage = shallow(
      <SprungbrettPage setLanguageChangeUrls={() => {}}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'employments'} />
    ).instance()
    expect(sprungbrettPage.getJobs()).toEqual([jobs[0], jobs[1]])
  })

  it('should set language change urls', () => {
    const setLanguageChangeUrls = jest.fn()
    const sprunbrettPage = shallow(
      <SprungbrettPage setLanguageChangeUrls={setLanguageChangeUrls}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'employments'} />
    ).instance()
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(setLanguageChangeUrls).toHaveBeenCalledWith(sprunbrettPage.instance().mapLanguageToUrl, languages)
  })

  it('should update language change urls only on relevant prop change', () => {
    const setLanguageChangeUrls = jest.fn()
    const sprunbrettPage = shallow(
      <SprungbrettPage setLanguageChangeUrls={setLanguageChangeUrls}
                       languages={languages}
                       location={location}
                       language={language}
                       sprungbrett={jobs}
                       type={'employments'} />
    ).instance()
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(1)
    sprunbrettPage.setProps({type: 'all', ...sprunbrettPage.props})
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(2)

    sprunbrettPage.setProps({type: 'employments', ...sprunbrettPage.props})
    expect(setLanguageChangeUrls.mock.calls).toHaveLength(2)
  })

  describe('connect', () => {
    const sprungbrettEndpoint = new EndpointBuilder('sprungbrett')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(jobs)
      .build()

    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, type: 'apprenticeships'}},
        languageChangeUrls: {}
      })

      const sprungbrettPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[sprungbrettEndpoint]}>
            <ConnectedSprungbrettPage />
          </EndpointProvider>
        </Provider>
      ).find(SprungbrettPage)

      expect(sprungbrettPage.props()).toEqual({
        type: 'apprenticeships',
        location: location,
        language: language,
        sprungbrett: jobs,
        dispatch: expect.any(Function)
      })
    })
  })
})
