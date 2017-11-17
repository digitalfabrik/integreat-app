import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import style from './PdfButton.css'

class PdfButton extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired
  }

  render () {
    return <a className={style.pdfWrapper} href={this.props.href} target="_blank">
      <FontAwesome name='file-pdf-o'/>
    </a>
  }
}

export default PdfButton
