// @flow

import { connect } from 'react-redux'
import React from 'react'
import compose from 'recompose/compose'

import withFetcher from '../../../modules/endpoint/hocs/withFetcher'
import PdfButton from '../components/PdfButton'
import Toolbar from '../../../modules/layout/components/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'

type Props = {
  location: string,
  language: string,
  path: string,
  categories: CategoriesMapModel
}

export class CategoriesToolbar extends React.PureComponent<Props> {
  getPdfFetchPath () {
    return `/${this.props.location}/${this.props.language}/fetch-pdf?url=${this.props.path}`
  }

  render () {
    try {
      this.props.categories.getCategoryByUrl(this.props.path)
      return <Toolbar>
        <PdfButton href={this.getPdfFetchPath()} />
      </Toolbar>
    } catch (e) {
      return <Toolbar />
    }
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language,
  path: state.router.pathname
})

export default compose(
  withFetcher('categories', null, null),
  connect(mapStateToProps)
)(CategoriesToolbar)
