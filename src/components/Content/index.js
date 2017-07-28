import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { translate } from 'react-i18next'
import normalizeUrl from 'normalize-url'
import { transform, values } from 'lodash/object'

import Categories from './Categories'
import Page from './Page'

import style from './style.css'
import Hierarchy from 'routes/LocationPage/Hierarchy'
import Error from 'components/Error'
import TitledContentList from './TitledContentList'

class Content extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy),
    url: PropTypes.string.isRequired
  }

  renderPages () {
    let hierarchy = this.props.hierarchy

    let page = hierarchy.top()

    if (hierarchy.error()) {
      return <Error error={hierarchy.error()}/>
    } else if (!page) {
      return <Spinner className={style.loading} name='line-scale-party'/>
    } else {
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
    }

    throw new Error('The page ' + page + ' is not renderable!')
  }

  render () {
    return <div>
      {this.renderPages()}
    </div>
  }
}

export default translate('errors')(Content)
