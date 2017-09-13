import URLSearchParams from 'url-search-params'
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { forEach } from 'lodash/collection'
import PageModel from '../../endpoints/models/PageModel'
import style from './PDFButton.css'
import chunkedRequest from 'chunked-request'

class PDFButton extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    pages: PropTypes.arrayOf(PropTypes.instanceOf(PageModel)).isRequired,
    requestType: PropTypes.string.isRequired
  }

  constructor (params) {
    super(params)
    this.state = {pdf: '', loading: false}
  }

  fetchUrl () {
    this.setState(Object.assign({}, this.state, {loading: true}))

    const page = this.props.parentPage
    const url = 'https://cms.integreat-app.de/augsburg/wp-admin/admin-ajax.php'
    const pageIds = Object.assign([page.numericId], this.props.pages.map((page) => page.numericId))

    const params = {
      action: 'frontEndDownloadPDF',
      requestType: this.props.requestType,
      myContent: pageIds.join(','),
      pdfOptions: `,,${page.id}_file,,`,
      'ajaxVars[ajaxurl]': 'https://cms.integreat-app.de/ahaus/wp-admin/admin-ajax.php',
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
          const url = text.match(/(https?:\/\/)cms\.integreat-app\.de\/augsburg\/wp-content\/uploads\/[/\w-]*\.pdf/)[0]
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

export default PDFButton
