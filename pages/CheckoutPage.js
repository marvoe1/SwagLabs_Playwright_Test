const { expect } = require('@playwright/test');

exports.CheckoutPage = class checkoutPage {
  /**
   * @param {import ('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.cartList = page.locator("//div[@class='cart_list']");
    this.priceTotal = page.locator("//div[@class='summary_subtotal_label']");
    this.finishBtn = page.locator("//button[@id='finish']");
    this.confirmationText = page.locator(
      "//div[@id='checkout_complete_container']"
    );
  }
  async verifyCartContent() {
    await expect(this.cartList).toContainText("Sauce Labs Backpack");
    await expect(this.cartList).toContainText("Sauce Labs Bike Light");
  }

  async verifyTotal() {
    await expect(this.priceTotal).toContainText("$39.98");
  }

  async clickFinishButton() {
    await this.finishBtn.click();
  }

  async verifyConfirmationText() {
    await expect(this.confirmationText).toContainText("Thank you for your order");
  }
};
