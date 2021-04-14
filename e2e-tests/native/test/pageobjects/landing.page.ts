/**
 * sub page containing specific selectors and methods for a specific page
 */
import { Selector } from "../Selector";

class LandingPage {
    async exists() {
        const page = await $('~Landing-Page')
        return await page.waitForExist()
    }

    get cities() {
        return $$('~City-Entry')
    }

    get search() {
        return $('~Search-Input')
    }

    async city(name: string) {
        const selector = new Selector().ByContainsText(name).build()
        return $(selector)
    }
}

export default new LandingPage()
