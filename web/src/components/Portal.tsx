import { ReactNode, ReactPortal, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PropsType = {
  children: ReactNode
  className: string
  element?: string
  opened?: boolean
}
/** A portal creates a new DOM Node outside the regular DOM. You can use it f.e. to fix z-index problems */
const Portal = ({ children, className, element = 'reach-portal', opened = false }: PropsType): ReactPortal => {
  const [container] = useState(() => document.createElement(element))

  useEffect(() => {
    container.classList.add(className)
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [className, container])

  /* Add no-pointer events when portal is not opened to enable click events on underlying components */
  useLayoutEffect(() => {
    if (opened) {
      container.style.pointerEvents = 'auto'
    } else {
      container.style.pointerEvents = 'none'
    }
  }, [container, opened])

  return createPortal(children, container)
}

export default Portal
