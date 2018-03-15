// @flow

import { connect } from 'react-redux'
import PdfButton from '../components/PdfButton'
import React from 'react'
import Toolbar from '../../../modules/layout/components/Toolbar'

export class CategoriesToolbar extends React.PureComponent<{ location: string, language: string, path: string }> {
  getPdfFetchPath () {
    return `/${this.props.location}/${this.props.language}/fetch-pdf?url=${this.props.path}`
  }

  render () {
    return <Toolbar><PdfButton href={this.getPdfFetchPath()} /></Toolbar>
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language,
  path: state.router.pathname
})

export default connect(mapStateToProps)(CategoriesToolbar)
