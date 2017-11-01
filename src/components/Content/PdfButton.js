import React from 'react'
import FontAwesome from 'react-fontawesome'

import style from './PdfButton.css'

class PdfButton extends React.Component {
  render () {
    return <a className={style.pdfWrapper} href="?pdf" target="_blank">
      <FontAwesome name='file-pdf-o'/>
    </a>
  }
}

export default PdfButton
