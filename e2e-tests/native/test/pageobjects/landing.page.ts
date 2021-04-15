import {Page} from "./page";
import {Selector} from "../Selector";

class LandingPage extends Page{
    constructor() {
        super('Landing-Page');
    }

    get cities() {
        return $$('~City-Entry')
    }

    get search() {
        return $('~Search-Input')
    }

    async city(name: string) {
        return $(new Selector().ByText(name).build())
    }
}

export default new LandingPage()
