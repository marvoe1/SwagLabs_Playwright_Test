exports.LoginPage = class LoginPage {

    /**
     * @param {import ('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page
        this.usernameField = page.locator("//input[@id='user-name']");
        this.passwordField = page.locator("//input[@id='password']");
        this.loginButton = page.locator("//input[@id='login-button']")
        this.errormsg = page.locator("h3[data-test='error']");
    }

    async login(username, password) {
        await this.usernameField.fill(username)
        await this.passwordField.fill(password)
        await this.loginButton.click()
    }

    async errorMessage() {
        return this.errormsg.textContent()
    }
}