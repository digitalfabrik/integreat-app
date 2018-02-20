import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import LanguageSelector from 'modules/common/containers/LanguageSelector'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

class LanguageUnavailable extends React.PureComponent {
  static propTypes = {
    setLanguageChangeUrls: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired
  }

  /**
   * The function used to map different languages to their CategoriesPage
   * @param {string} language The language
   * @returns {string} The url of the CategoriesPage of a different language
   */
  mapLanguageToUrl = (language) => `/${this.props.location}/${language}`

  /**
   * Gets and stores the available languages for the current page
   */
  setLanguageChangeUrls () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages)
  }

  componentWillMount () {
    this.setLanguageChangeUrls()
  }

  render () {
    return <React.Fragment>
      <p style={{
        textAlign: 'center',
        margin: '25px 0'
      }}>{this.props.t('common:siteAvailableInTheFollowingLanguages')}</p>
      <LanguageSelector />
    </React.Fragment>
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages) => dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

const mapStateToProps = (state) => ({
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('languages'),
  translate('common')
)(LanguageUnavailable)
