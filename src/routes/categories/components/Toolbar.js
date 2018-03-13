// @flow

import React from 'react'
import PdfButton from './PdfButton'

type Props = {
  pdfHref: string
}

class Toolbar extends React.Component<Props> {
  render () {
    return <div>
      <PdfButton href={this.props.pdfHref} />
    </div>
  }
}

export default Toolbar
