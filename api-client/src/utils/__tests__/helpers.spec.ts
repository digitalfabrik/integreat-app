import { parseHTML } from '../helpers'

const htmlContent =
  '<main><p>From January 1st, 2022, plastic shopping bags will no longer be allowed to be offered in shops throughout Germany. More specifically the ban is on the light plastic carrier bags with a thickness between 15 and 50 micrometer. These are the standard bags that you used to get when you went shopping. Particularly sturdy reusable bags and the thin plastic bags found at fruit and vegetable stands are excluded from the ban. Why aren&#8217;t these bags banned as well? The federal government fears that manufacturers will then start packaging more products in plastic again.</p><p><a href="https://www.bundesregierung.de/breg-de/aktuelles/dunne-plastiktueten-verboten-1688818">https://www.bundesregierung.de/breg-de/aktuelles/dunne-plastiktueten-verboten-1688818</a></p><p>tun22010404</p><p>Ab dem 1. Januar 2022 d&#252;rfen in deutschen Gesch&#228;ften keine Einkaufst&#252;ten aus Plastik mehr angeboten werden, die abgebildeten Plastikt&#252;ten f&#252;r Obst und Gem&#252;se sind aber weiterhin erlaubt. Foto: t&#252;news INTERNATIONAL.</p><h1><a href="https://tunewsinternational.com/category/corona-english/">Latest information on Corona: Click here</a></h1></main>'
const contentWithoutHtml =
  'From January 1st, 2022, plastic shopping bags will no longer be allowed to be offered in shops throughout Germany. More specifically the ban is on the light plastic carrier bags with a thickness between 15 and 50 micrometer. These are the standard bags that you used to get when you went shopping. Particularly sturdy reusable bags and the thin plastic bags found at fruit and vegetable stands are excluded from the ban. Why aren’t these bags banned as well? The federal government fears that manufacturers will then start packaging more products in plastic again.https://www.bundesregierung.de/breg-de/aktuelles/dunne-plastiktueten-verboten-1688818tun22010404Ab dem 1. Januar 2022 dürfen in deutschen Geschäften keine Einkaufstüten aus Plastik mehr angeboten werden, die abgebildeten Plastiktüten für Obst und Gemüse sind aber weiterhin erlaubt. Foto: tünews INTERNATIONAL.Latest information on Corona: Click here'

describe('helpers', () => {
  describe('parseHTML', () => {
    it('should decode HTML entities', () => {
      const parsedResult = parseHTML('&#8220;&#8364;&#8221;')
      expect(parsedResult).toBe('“€”')
    })

    it('should remove html tags', () => {
      const parsedResult = parseHTML(htmlContent)
      expect(parsedResult).toBe(contentWithoutHtml)
    })
  })
})
