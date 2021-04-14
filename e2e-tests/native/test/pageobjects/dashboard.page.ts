
class DashboardPage {

    async exists () {
        const res = await $('~Dashboard-Page')
        return await res.waitForExist()
    }
}

export default new DashboardPage()