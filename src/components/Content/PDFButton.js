import React from 'react'
import FontAwesome from 'react-fontawesome'

import style from './PDFButton.css'

class PDFButton extends React.Component {
  render () {
    return <a className={style.pdfWrapper} href="?pdf" target="_blank">
      <FontAwesome name='file-pdf-o'/>
    </a>
  }
}

export default PDFButton
