
/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage {
    public language: string;

    public constructor (language = 'en') {
      this.language = language
    }

    get cities () {
      return $$('//main//a')
    }

    get search () {
      return $('~Search-Input')
    }

    city (name: string) {
      return $(`*=${name}`)
    }
}

export default new LandingPage()
