// @flow

import React from 'react'
import FontAwesome from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'

import style from './PdfButton.css'

type Props = {
  href: string
}

class PdfButton extends React.Component<Props> {
  render () {
    return <div>
      <a className={style.pdfWrapper} data-tip={'test'} href={this.props.href} target='_blank'>
        <FontAwesome name='file-pdf-o' />
      </a>
      <ReactTooltip place='top' type='dark' effect='solid' />
    </div>
  }
}

export default PdfButton
