import React from 'react'

import { history } from 'main'

class ErrorPage extends React.Component {
  componentDidMount () {

  }

  /**
   * Go back in history!!
   * @param event The click event
   */
  goBack = (event) => {
    event.preventDefault()
    history.goBack()
  }

  render () {
    return (
      <div>
        <a href="/" onClick={this.goBack}>Go back</a>
      </div>
    )
  }
}

export default ErrorPage
