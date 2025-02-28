exports.ShippingPage = class shippingPage {
  /**
   * @param {import ('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.shippingFirstName = page.locator("//input[@id='first-name']");
    this.shippingLastName = page.locator("//input[@id='last-name']");
    this.postalCode = page.locator("//input[@id='postal-code']");
    this.continueBtn = page.locator("//input[@id='continue']");
  }


  async fillShippingDetails(firstName, lastName, postalCode) {
    await this.shippingFirstName.fill(firstName);
    await this.shippingLastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async clickContinueButton() {
    await this.continueBtn.click();
  }
};
