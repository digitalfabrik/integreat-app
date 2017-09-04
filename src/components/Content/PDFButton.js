import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import { forEach } from 'lodash/collection'
import PageModel from '../../endpoints/models/PageModel'
import style from './PDFButton.css'

function processChunkedResponse (response) {
  let text = ''
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  return readChunk()

  function readChunk () {
    return reader.read().then(appendChunks)
  }

  function appendChunks (result) {
    text += decoder.decode(result.value || new Uint8Array(), {stream: !result.done})
    if (result.done) {
      return text
    } else {
      return readChunk()
    }
  }
}

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
    const pageIds = Object.assign([page.id], this.props.pages.map((page) => page.id))

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

    let requestParams = {
      method: 'POST',
      mode: 'cors',
      body
    }
    fetch(url, requestParams)
      .then(processChunkedResponse)
      .then((text) => {
        return text.match(/(https?:\/\/)cms\.integreat-app\.de\/augsburg\/wp-content\/uploads\/[/\w-]*\.pdf/)[0]
      })
      .then((url) => {
        this.setState({pdf: url, loading: false})
      })
      .catch(() => {
        this.setState({loading: false})
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
