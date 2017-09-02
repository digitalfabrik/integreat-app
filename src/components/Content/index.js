import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import normalizeUrl from 'normalize-url'
import { transform, values } from 'lodash/object'

import Categories from './Categories'
import Page from './Page'

import Hierarchy from 'routes/LocationPage/Hierarchy'
import Error from 'components/Error'
import TitledContentList from './TitledContentList'
import { forEach } from 'lodash/collection'

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

class Content extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy),
    url: PropTypes.string.isRequired
  }

  constructor (params) {
    super(params)
    this.state = {pdf: ''}
  }

  componentDidMount () {
    const hierarchy = this.props.hierarchy
    const page = hierarchy.top()
    this.fetchUrl(page)
  }

  fetchUrl (page) {
    const url = 'https://cms.integreat-app.de/augsburg/wp-admin/admin-ajax.php'

    const params = {
      action: 'frontEndDownloadPDF',
      requestType: 'page',
      myContent: `${page.id}`,
      pdfOptions: `,,${page.id}_file,,`,
      'ajaxVars[ajaxurl]': 'https://cms.integreat-app.de/ahaus/wp-admin/admin-ajax.php',
      font: '',
      fontcolor: '',
      bgcolor: '',
      linkcolor: '',
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
        return this.setState({pdf: url})
      })
  }

  renderPages () {
    const hierarchy = this.props.hierarchy
    const page = hierarchy.top()

    let children = values(page.children).length

    if (children === 0) {
      return <Page page={page}/>
    } else if (children > 0) {
      let url = normalizeUrl(this.props.url, {removeTrailingSlash: true})
      let base = url + hierarchy.path()

      let pages = transform(page.children, (result, page, id) => { result[base + '/' + id] = page })

      return hierarchy.root() ? <Categories pages={pages}/>
        : <TitledContentList pages={pages} parentPage={page}/>
    }

    throw new Error('The page ' + page + ' is not renderable!')
  }

  render () {
    return <div>
      {this.state.pdf}
      {this.renderPages()}
    </div>
  }
}

export default translate('errors')(Content)
