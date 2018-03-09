import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import chunkedRequest from 'chunked-request'
import { connect } from 'react-redux'
import escapeRegExp from 'escape-string-regexp'
import { isEmpty } from 'lodash/lang'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'

import LocationModel from 'modules/endpoint/models/LocationModel'
import style from './PdfFetcherPage.css'
import Failure from 'modules/common/components/Failure'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import { apiUrl } from 'modules/endpoint/constants'

class PdfFetcherPage extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    categories: PropTypes.instanceOf(CategoriesMapModel).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    fetchUrl: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor (params) {
    super(params)
    this.state = {pdf: '', loading: false}
  }

  componentWillMount () {
    const category = this.props.categories.getCategoryByUrl(this.props.fetchUrl)
    if (category) {
      this.fetchUrl(category)
    }
  }

  addCategoryIdsRecursively (categoryIds, children) {
    children.forEach(child => {
      categoryIds.push(child.id)
      this.addCategoryIdsRecursively(categoryIds, this.props.categories.getChildren(child))
    })
  }

  getFont () {
    switch (this.props.language) {
      case 'ar':
        return 'aefurat'
      case 'fa':
        return 'dejavusans'
      default:
        return ''
    }
  }

  getTitle (title) {
    const location = this.props.locations.find(location => location.code === title)
    return location ? location.name : title
  }

  fetchUrl (category) {
    const url = `${apiUrl}/${this.props.location}/wp-admin/admin-ajax.php`
    const categoryIds = []
    const requestType = 'page'
    /* 'allpages' is available for the root page, but 'allpages' doesn't work with all
                                     languages, so we just always use 'page' as requestType. */
    const font = this.getFont()
    const title = this.getTitle(category.title)
    const children = this.props.categories.getChildren(category)
    const toc = isEmpty(children)

    this.setState(prevState => ({...prevState, loading: category}))

    if (category.id !== 0) {
      categoryIds.push(category.id)
    }
    this.addCategoryIdsRecursively(categoryIds, children)

    const params = {
      action: 'frontEndDownloadPDF',
      requestType: requestType,
      myContent: categoryIds.join(','),
      pdfOptions: `${toc},${title},${category.id}_file,,`,
      'ajaxVars[ajaxurl]': `https://cms.integreat-app.de/${this.props.location}/wp-admin/admin-ajax.php`,
      font,
      fontcolor: '',
      bgcolor: '',
      linkcolor: ''
    }

    const body = new URLSearchParams(params)
    // Currently the backend can only use the 'Referer' header, to determine which language the PDF should have (not sure).
    // We cannot modify the 'Referer'-header and we are just lucky that it works I think.
    // The old JQuery webapp also sended following cookies to the backend which it maybe used to determine the language.
    // 'Cookie': `_icl_current_language=${this.props.languageCode}; integreat_lang=${this.props.languageCode}`
    let text = ''
    const decoder = new TextDecoder()
    chunkedRequest({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;' // Currently IE11 does another request which fails because it appends a \n before Content-Type
        // But other request succeeds so let's ignore it
      },
      body,
      chunkParser: bytes => { text += decoder.decode(bytes) },
      onComplete: () => {
        if (!category === this.state.loading) {
          return
        }

        const regex = `${escapeRegExp(`https://cms.integreat-app.de/${this.props.location}/wp-content/uploads/`)}[\\w|/|-]*\\.pdf`
        const match = text.match(new RegExp(regex))

        if (isEmpty(match)) {
          console.error('No match found for PDF-Url.')
          this.setState({loading: false})
          return
        }

        this.setState({pdf: match[0], loading: false})
        // PdfProcessingPage shouldn't appear in browser history
        window.location.replace(match[0])
      }
    })
  }

  render () {
    const {t} = this.props
    if (this.state.loading) {
      return <div className={style.pdfFetcher}>
        <p>{t('creatingPdf')}</p>
        <Spinner name='line-scale-party' />
      </div>
    } else if (!this.state.pdf) {
      return <Failure error='pdf-fetcher:page.loadingFailed' />
    } else {
      return <div className={style.pdfFetcher}>
        <p>{t('downloadPdfAt')}</p>
        <p><a href={this.state.pdf}>{this.state.pdf}</a></p>
      </div>
    }
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language,
  fetchUrl: state.router.query.url
})

export default compose(
  connect(mapStateToProps),
  translate('pdf-fetcher')
)(PdfFetcherPage)
