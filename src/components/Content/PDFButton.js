import URLSearchParams from 'url-search-params'
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { forEach } from 'lodash/collection'
import PageModel from '../../endpoints/models/PageModel'
import style from './PDFButton.css'
import chunkedRequest from 'chunked-request'
import { connect } from 'react-redux'
import escapeRegExp from 'escape-string-regexp'

class PDFButton extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    requestType: PropTypes.string.isRequired,
    locationCode: PropTypes.string.isRequired
  }

  constructor (params) {
    super(params)
    this.state = {pdf: '', loading: false}
  }

  buildPageIds (pageIds, parentPage) {
    pageIds.push(parentPage.numericId)
    parentPage.children.forEach((page) => this.buildPageIds(pageIds, page))
  }

  fetchUrl () {
    this.setState(Object.assign({}, this.state, {loading: true}))

    const page = this.props.parentPage
    const url = `https://cms.integreat-app.de/${this.props.locationCode}/wp-admin/admin-ajax.php`
    const pageIds = []
    if (this.props.requestType === 'page') {
      this.buildPageIds(pageIds, this.props.parentPage)
    }

    const params = {
      action: 'frontEndDownloadPDF',
      requestType: this.props.requestType,
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
    let text = ''
    let decoder = new TextDecoder()
    chunkedRequest({
      url,
      method: 'POST',
      body,
      chunkParser: (bytes) => { text += decoder.decode(bytes) },
      onComplete: () => {
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
