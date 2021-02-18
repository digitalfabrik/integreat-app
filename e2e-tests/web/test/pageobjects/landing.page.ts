import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage extends Page {

    public language: string;

    public constructor(language: string = 'en') {
        super();
        this.language = language
    }

    get cities () { return $$('//main//a') }
    get search () { return $('//main//input') }

    city(name: string) {
        return $(`*=${name}`)
    }

    open () {
        return super.open(`landing/${this.language}`);
    }
}

export default new LandingPage();
