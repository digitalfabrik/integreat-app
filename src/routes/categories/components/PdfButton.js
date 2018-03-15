// @flow

import React, { Fragment } from 'react'
import FontAwesome from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { translate } from 'react-i18next'

import style from './PdfButton.css'

type Props = {
  href: string,
  t: Function
}

class PdfButton extends React.PureComponent<Props> {
  render () {
    return <Fragment>
      <a className={style.pdfWrapper} data-tip={this.props.t('createPdf')}
         data-delay-show={300} href={this.props.href} target='_blank'>
        <FontAwesome name='file-pdf-o' />
      </a>
      <ReactTooltip place='top' type='dark' effect='solid' />
    </Fragment>
  }
}

export default translate('layout')(PdfButton)
