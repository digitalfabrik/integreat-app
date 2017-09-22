import React from 'react'
import PropTypes from 'prop-types'

import style from './TitledContentList.css'
import PageModel from 'endpoints/models/PageModel'
import ContentList from './ContentList'

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

            <div className={style.shortText}
                 dangerouslySetInnerHTML={{__html: (this.props.parentPage.content)}}/>
          </div>
        </div>
        <ContentList pages={this.props.pages}/>
      </div>
    )
  }
}

export default TitledContentList
