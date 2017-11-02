import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import compose from 'lodash/fp/compose'

import Layout from '../Layout/index'
import Header from './Header'
import Footer from './Footer'
import PageModel from '../../endpoints/models/PageModel'
import PAGE_ENDPOINT from '../../endpoints/page'
import Hierarchy from '../../routes/LocationPage/Hierarchy'
import withFetcher from '../../endpoints/withFetcher'

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string,
    pages: PropTypes.instanceOf(PageModel).isRequired,
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired
  }

  constructor (props) {
    super(props)

    this.gotoNewPath = this.gotoNewPath.bind(this)
  }

  /**
   * searches for the pageId of a page in pages
   * @param page the root page (containig the other pages as children)
   * @param pageId of the page to be searched for
   * @param path string array to store the path of the found page
   * @returns {*} path with the absolute path of the found page as string array
   */
  findPage (page, pageId, path) {
    path.push(page.id)
    console.log('page' + page.numericId)
    if (page.numericId === pageId) {
      console.log('foundPath: ' + page.id)
      return path
    } else if (page['children']) {
      page['children'].forEach((children) => {
        let result = this.findPage(children, pageId, path)
        if (result) return result
      })
      return null
    }
    path.pop(page.id)
    return null
  }

  /**
   * gets the path of the current page in the new Language
   * @param newLanguage the language to change to
   * @returns {*} new Path to goto
   */
  getNewPath (newLanguage) {
    let pageId = this.props.hierarchy.top().availableLanguages[newLanguage]

    /* LocationHome, CMS returns no availableLanguages */
    if (!pageId) return this.getParentPath(newLanguage)

    console.log('pageID' + pageId)
    let path = []
    let newPath = this.findPage(this.props.pages, pageId, path)

    return `/${newPath.join('/')}/${newLanguage}/`
  }

  getParentPath (newLanguage) {
    if (!this.props.location) {
      return '/'
    }
    return `/${this.props.location}/${newLanguage}`
  }

  gotoNewPath (newLanguage) {
    this.props.dispatch(push(this.getNewPath(newLanguage)))
  }

  render () {
    return (<div>
        <Header languageCallback={this.gotoNewPath}/>

        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>

        <Footer/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ location: state.router.params.location })

export default compose(
  connect(mapStateToProps),
  withFetcher(PAGE_ENDPOINT)
)(RichLayout)
