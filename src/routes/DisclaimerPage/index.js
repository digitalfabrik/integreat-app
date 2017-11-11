import React from 'react'
import PropTypes from 'prop-types'

import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import PageModel from 'endpoints/models/PageModel'
import withFetcher from 'endpoints/withFetcher'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'
import LANGUAGE_ENDPOINT from 'endpoints/language'
import LanguageModel from '../../endpoints/models/LanguageModel'
import { setCurrentAvailableLanguages } from 'actions'
import {connect} from 'react-redux'
import compose from 'redux/es/compose'

class ContentWrapper extends React.Component {
  static propTypes = {
    /**
     * from withFetcher HOC which provides data from DISCLAIMER_ENDPOINT
     */
    disclaimer: PropTypes.instanceOf(PageModel),
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    location: PropTypes.string
  }

  componentDidMount () {
    this.updateAvailableLanguages()
  }

  updateAvailableLanguages () {
    const redirect = (language) => `/${this.props.location}/${language}/disclaimer`
    const currentAvailableLanguages = this.props.languages.reduce((acc, language) => Object.assign(acc, { [language.code]: redirect(language.code) }), {})
    this.props.dispatch(setCurrentAvailableLanguages(currentAvailableLanguages))
  }

  componentWillUnmount () {
    this.props.dispatch(setCurrentAvailableLanguages({}))
  }

  render () {
    return <Page page={this.props.disclaimer}/>
  }
}

const mapStateToProps = (state) => ({ location: state.router.params.location })

const FetchingContentWrapper = compose(
  withFetcher(DISCLAIMER_ENDPOINT),
  withFetcher(LANGUAGE_ENDPOINT),
  connect(mapStateToProps)
)(ContentWrapper)

class DisclaimerPage extends React.Component {
  render () {
    return (
      <RichLayout>
        <FetchingContentWrapper/>
      </RichLayout>
    )
  }
}

export default DisclaimerPage
