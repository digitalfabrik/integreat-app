import React from 'react'
import PropTypes from 'prop-types'

import style from './TitledContentList.css'
import PageModel from 'modules/endpoint/models/CategoryModel'
import ContentList from './ContentList'
import RemoteContent from 'modules/common/components/RemoteContent'

class TitledContentList extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    return (
      <div>
        <div className={style.horizontalLine}>
          <div className={style.heading}>
            <img className={style.headingImage} src={this.props.parentPage.thumbnail}/>
            <div className={style.headingText}>{this.props.parentPage.title}</div>
            <RemoteContent className={style.shortText} dangerouslySetInnerHTML={{__html: this.props.parentPage.content}}/>
          </div>
        </div>
        <ContentList pages={this.props.pages}/>
      </div>
    )
  }
}

export default TitledContentList
