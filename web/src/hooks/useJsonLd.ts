import { useEffect } from 'react'
import type { Thing, WithContext } from 'schema-dts'

const useJsonLd = (jsonLd: WithContext<Thing> | null): void => {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    if (!jsonLdString) {
      return undefined
    }
    const newScriptElement = document.createElement('script')
    newScriptElement.type = 'application/ld+json'
    newScriptElement.textContent = jsonLdString
    document.head.appendChild(newScriptElement)
    return () => newScriptElement.remove()
  }, [jsonLdString])
}

export default useJsonLd
