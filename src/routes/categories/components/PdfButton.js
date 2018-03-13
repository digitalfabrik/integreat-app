// @flow

import React from 'react'
import FontAwesome from 'react-fontawesome'

import style from './PdfButton.css'

type Props = {
  href: string
}

class PdfButton extends React.Component<Props> {
  render () {
    return <a className={style.pdfWrapper} href={this.props.href} target='_blank'>
      <FontAwesome name='file-pdf-o' />
    </a>
  }
}

export default PdfButton
