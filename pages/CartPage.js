const { expect } = require('@playwright/test');

exports.CartPage = class cartPage {

    /**
     * @param {import ('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.cartItem = page.locator("//div[@class='cart_list']");
        this.checkoutButton = page.locator("//button[@id='checkout']");
     }
    async verifyCartContent() {
        await this.cartItem.first().waitFor();
        await expect(this.cartItem).toContainText("Sauce Labs Backpack");
        await expect(this.cartItem).toContainText("Sauce Labs Bike Light");

    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}