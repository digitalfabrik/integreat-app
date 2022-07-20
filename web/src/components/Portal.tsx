import React, { ReactNode, ReactPortal, useEffect } from 'react'
import ReactDOM from 'react-dom'

type PropsType = {
  children: ReactNode
  className: string
  element?: string
  open?: boolean
}
/** A Portal creates a new DOM Node Outside of the regular DOM. You can use it f.e. to fix z-index problems */
export const Portal = ({ children, className, element = 'reach-portal', open = false }: PropsType): ReactPortal => {
  const [container] = React.useState(() =>
    // This will be executed only on the initial render
    // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    document.createElement(element)
  )
  // TODO IGAPP-1067 this additional dependency (open) which is needed to click on the Map while the portal is opened, breaks sidebar animation
  useEffect(() => {
    /* Add no-pointer events when portal is not opened to enable click events on underlying components */
    if (!open) {
      container.style.pointerEvents = 'none'
    } else {
      container.style.pointerEvents = 'auto'
    }
    container.classList.add(className)
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [className, container, open])

  return ReactDOM.createPortal(children, container)
}
