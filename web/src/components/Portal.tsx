import React, { ReactNode, ReactPortal, useEffect, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'

type PropsType = {
  children: ReactNode
  className: string
  element?: string
  opened?: boolean
}
/** A portal creates a new DOM Node outside the regular DOM. You can use it f.e. to fix z-index problems */
export const Portal = ({ children, className, element = 'reach-portal', opened = false }: PropsType): ReactPortal => {
  const [container] = React.useState(() =>
    // This will be executed only on the initial render
    // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    document.createElement(element)
  )

  useEffect(() => {
    container.classList.add(className)
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [className, container])

  /* Add no-pointer events when portal is not opened to enable click events on underlying components */
  useLayoutEffect(() => {
    if (!opened) {
      container.style.pointerEvents = 'none'
    } else {
      container.style.pointerEvents = 'auto'
    }
  }, [container, opened])

  return ReactDOM.createPortal(children, container)
}
