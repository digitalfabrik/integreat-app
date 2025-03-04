import { DomUtils, parseDocument } from 'htmlparser2'

const addingPeriodsToDom = (html: string): string => {
  const dom = parseDocument(html)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appendPeriod = (elements: any[]) => {
    elements.forEach(element => {
      const textContent = DomUtils.textContent(element).trim()
      if (textContent && !textContent.endsWith('.')) {
        // eslint-disable-next-line no-param-reassign
        element.children = [{ type: 'text', data: textContent.concat('.') }]
      }
    })
  }

  const paragraphs = DomUtils.findAll(elem => elem.tagName === 'p', dom.children)
  const listItems = DomUtils.findAll(elem => elem.tagName === 'li', dom.children)

  appendPeriod(paragraphs)
  appendPeriod(listItems)

  return DomUtils.textContent(dom)
}

export default addingPeriodsToDom
