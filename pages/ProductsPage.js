exports.Productspage = class ProductsPage {
  /**
   *
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sauceLabsBikeLightAddToCart = page.locator(
      "//button[@id='add-to-cart-sauce-labs-bike-light']"
    );
    this.sauceLabsBackpack = page.locator(
      "//button[@id='add-to-cart-sauce-labs-backpack']"
    );
    this.cartNumber = page.locator("//span[@class='shopping_cart_badge']");
    this.removeSauceLabBikeLightBtn = page.locator(
      "//button[@id='remove-sauce-labs-bike-light']"
    );
    this.removeSauceLabsBackpackBtn = page.locator(
      "//button[@id='remove-sauce-labs-backpack']"
    );
    this.cartButton = page.locator("//a[@class='shopping_cart_link']");
  }
  async addSauceLabBikeLightToCart() {
    await this.sauceLabsBikeLightAddToCart.click();
  }
  async addSauceLabsBackpackToCart() {
    await this.sauceLabsBackpack.click();
  }

  async getNumberOfItemsInCart() {
    // await this.cartNumber.waitFor();
    return this.cartNumber.textContent();
  }

  async removeSauceLabBikeLightFromCart() {
    await this.removeSauceLabBikeLightBtn.click();
  }
  async removeSauceLabsBackpackFromCart() {
    await this.removeSauceLabsBackpackBtn.click();
  }

  async goToCart() {
    await this.cartButton.click();
  }
};
