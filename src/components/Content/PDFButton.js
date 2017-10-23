import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import chunkedRequest from 'chunked-request'
import { connect } from 'react-redux'
import escapeRegExp from 'escape-string-regexp'
import { isEmpty } from 'lodash/lang'

import PageModel from '../../endpoints/models/PageModel'
import style from './PDFButton.css'

class PDFButton extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    location: PropTypes.string.isRequired
  }

  constructor (params) {
    super(params)
    this.state = {pdf: '', loading: false}
  }

  addPageIdsRecursively (pageIds, parentPage) {
    pageIds.push(parentPage.numericId)
    parentPage.children.forEach((page) => this.addPageIdsRecursively(pageIds, page))
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.page !== nextProps.page || this.props.location !== nextProps.location) {
      Object.assign(nextState, {pdf: false, loading: false})
    }
  }

  fetchUrl () {
    const page = this.props.page
    const url = `https://cms.integreat-app.de/${this.props.location}/wp-admin/admin-ajax.php`
    const pageIds = []
    const requestType = page.numericId === 0 ? 'allpages' : 'page'

    this.setState(Object.assign({}, this.state, {loading: page}))

    if (requestType === 'page') {
      this.addPageIdsRecursively(pageIds, page)
    }

    const params = {
      action: 'frontEndDownloadPDF',
      requestType: requestType,
      myContent: pageIds.join(','),
      pdfOptions: `,,${page.id}_file,,`,
      'ajaxVars[ajaxurl]': `https://cms.integreat-app.de/${this.props.location}/wp-admin/admin-ajax.php`,
      font: '',
      fontcolor: '',
      bgcolor: '',
      linkcolor: ''
    }

    let body = new URLSearchParams(params)
    // Currently the backend can only use the 'Referer' header, to determine which language the PDF should have (not sure).
    // We cannot modify the 'Referer'-header and we are just lucky that it works I think.
    // The old JQuery webapp also sended following cookies to the backend which it maybe used to determine the language.
    // 'Cookie': `_icl_current_language=${this.props.languageCode}; integreat_lang=${this.props.languageCode}`
    let text = ''
    let decoder = new TextDecoder()
    chunkedRequest({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
      chunkParser: (bytes) => { text += decoder.decode(bytes) },
      onComplete: () => {
        if (!page === this.state.loading) {
          return
        }

        const regex = escapeRegExp(`https://cms.integreat-app.de/${this.props.location}/wp-content/uploads/`) + '[\\w|/|-]*\\.pdf'
        const match = text.match(new RegExp(regex))
        if (isEmpty(regex)) {
          this.setState({loading: false})
          return
        }

        this.setState({pdf: match[0], loading: false})
      }
    })
  }

  getCurrentButton () {
    if (this.state.loading) {
      return <FontAwesome name='spinner' spin/>
    } else if (this.state.pdf) {
      return <FontAwesome name='file-pdf-o' onClick={() => window.open(this.state.pdf, '_blank')}/>
    } else {
      return <FontAwesome name='download' onClick={() => this.fetchUrl()}/>
    }
  }

  render () {
    return <div className={style.pdfWrapper}>{this.getCurrentButton()}</div>
  }
}

function mapStateToProps (state) {
  return {
    location: state.router.params.location
  }
}

export default connect(mapStateToProps)(PDFButton)
