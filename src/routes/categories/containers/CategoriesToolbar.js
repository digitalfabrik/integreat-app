// @flow

import { connect } from 'react-redux'
import React from 'react'
import compose from 'recompose/compose'
import { translate } from 'react-i18next'

import withFetcher from '../../../modules/endpoint/hocs/withFetcher'
import Toolbar from '../../../modules/layout/components/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'

type Props = {
  location: string,
  language: string,
  path: string,
  categories: CategoriesMapModel,
  t: string => string
}

export class CategoriesToolbar extends React.PureComponent<Props> {
  getPdfFetchPath () {
    return `/${this.props.location}/${this.props.language}/fetch-pdf?url=${this.props.path}`
  }

  render () {
    try {
      this.props.categories.getCategoryByUrl(this.props.path)
      return <Toolbar>
        <ToolbarItem name='file-pdf-o' text={this.props.t('createPdf')} href={this.getPdfFetchPath()} />
        {/* todo: Add these functionalities:
        <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
        <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
        <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
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
  translate('categories'),
  withFetcher('categories', null, null),
  connect(mapStateToProps)
)(CategoriesToolbar)
