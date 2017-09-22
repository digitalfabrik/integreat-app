import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { forEach } from 'lodash/collection'
import URLSearchParams from 'url-search-params'
import chunkedRequest from 'chunked-request'
import { connect } from 'react-redux'
import escapeRegExp from 'escape-string-regexp'
import { TextDecoder } from 'text-encoding'

import PageModel from '../../endpoints/models/PageModel'
import style from './PDFButton.css'

class PDFButton extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    locationCode: PropTypes.string.isRequired,
    languageCode: PropTypes.string.isRequired
  }

  constructor (params) {
    super(params)
    this.state = {pdf: '', loading: false}
  }

  buildPageIds (pageIds, parentPage) {
    pageIds.push(parentPage.numericId)
    parentPage.children.forEach((page) => this.buildPageIds(pageIds, page))
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.page !== nextProps.page || this.props.locationCode !== nextProps.locationCode) {
      Object.assign(nextState, { pdf: false, loading: false })
    }
  }

  fetchUrl () {
    let page = this.props.page
    this.setState(Object.assign({}, this.state, {loading: page}))
    const url = `https://cms.integreat-app.de/${this.props.locationCode}/wp-admin/admin-ajax.php`
    const pageIds = []
    const requestType = page.numericId === 0 ? 'allpages' : 'page'
    if (requestType === 'page') {
      this.buildPageIds(pageIds, page)
    }

    const params = {
      action: 'frontEndDownloadPDF',
      requestType: requestType,
      myContent: pageIds.join(','),
      pdfOptions: `,,${page.id}_file,,`,
      'ajaxVars[ajaxurl]': `https://cms.integreat-app.de/${this.props.locationCode}/wp-admin/admin-ajax.php`,
      font: '',
      fontcolor: '',
      bgcolor: '',
      linkcolor: ''
    }

    let body = new URLSearchParams(params)
    forEach(params, (value, key) => body.append(key, value))
    const headers = {
      'Access-Control-Allow-Credentials': 'true',
      'Accept-Language': this.props.languageCode,
      'Cookie': `_icl_current_language=${this.props.languageCode}; integreat_lang=${this.props.languageCode}`
    }
    let text = ''
    let decoder = new TextDecoder()
    chunkedRequest({
      url,
      method: 'POST',
      body,
      headers,
      chunkParser: (bytes) => { text += decoder.decode(bytes) },
      onComplete: () => {
        if (!page === this.state.loading) {
          return
        }
        try {
          const regex = escapeRegExp(`https://cms.integreat-app.de/${this.props.locationCode}/wp-content/uploads/`) + '[\\w|/|-]*\\.pdf'
          const url = text.match(new RegExp(regex))[0]
          this.setState({pdf: url, loading: false})
        } catch (e) {
          this.setState({loading: false})
        }
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

const mapStateToProps = (state) => { return { locationCode: state.router.params.location } }

export default connect(mapStateToProps)(PDFButton)
