import { test, expect } from "@playwright/test";
import * as fs from "fs";
import path from "path";
import { LoginPage } from "../pages/LoginPage";
import { Productspage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { ShippingPage } from "../pages/ShippingPage";
import { CheckoutPage } from "../pages/CheckoutPage";

// Import JSON data
const testData = JSON.parse(
  fs.readFileSync("./test_data/testData.json", "utf-8")
);

// test.describe.configure({
//   mode: "serial",
// });

test.describe.serial(
  "Postive Login Test",
  {
    tag: "@PositiveTest",
  },
  () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
      await page.goto("/");
    });

    test("Validate that the user can login with valid credentials", async () => {
      const loginPage = new LoginPage(page);

      const username = testData.valid_user.username;
      const password = testData.valid_user.password;

      await test.step("Login with valid credentials", async () => {
        await loginPage.login(username, password);
        await expect(page).toHaveTitle("Swag Labs");
      });
    });

    test("Validate that the user can view the products page", async () => {
      await test.step("Login with valid credentials", async () => {
        await expect(page).toHaveTitle("Swag Labs");
      });
    });
  }
);

test.describe.serial(
  "Add Product to Cart and proceed to checkout",
  {
    tag: "@PositiveTest",
  },
  () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
      await page.goto("/");
      const loginPage = new LoginPage(page);

      const username = testData.valid_user.username;
      const password = testData.valid_user.password;

      await loginPage.login(username, password);
    });

    test("Validate that users can add multiple items to their cart", async () => {
      const productsPage = new Productspage(page);

      await test.step("Add multiple items to cart", async () => {
        await productsPage.addSauceLabBikeLightToCart();
        await productsPage.addSauceLabsBackpackToCart();
        expect(await productsPage.getNumberOfItemsInCart()).toBe("2");
      });
    });

    test("Validate that users can remove items from their cart", async () => {
      const productsPage = new Productspage(page);

      await test.step("Remove items from cart", async () => {
        await productsPage.removeSauceLabBikeLightFromCart();
        await productsPage.removeSauceLabsBackpackFromCart();
      });
    });

    test("Validate that users can re-add multiple items to their cart", async () => {
      const productsPage = new Productspage(page);

      await test.step("Add multiple items to cart", async () => {
        await productsPage.addSauceLabBikeLightToCart();
        await productsPage.addSauceLabsBackpackToCart();
        expect(await productsPage.getNumberOfItemsInCart()).toBe("2");
      });
    });

    test("Validate that when the user clicks the cart button, they are redirected to the cart page", async () => {
      const productsPage = new Productspage(page);

      await test.step("Click the cart button", async () => {
        await productsPage.goToCart();
        await expect(page).toHaveURL(
          `${process.env.PUBLIC_BASE_URL}/cart.html`
        );
      });
    });

    test("Validate that the user can view the products they selected in their cart", async () => {
      const cartPage = new CartPage(page);

      await test.step("Verify cart content", async () => {
        await cartPage.verifyCartContent();
      });

      await test.step("Verify that when the user clicks the checkout button, they are redirected to the Shipping Information Page", async () => {
        await cartPage.goToCheckout();
        await expect(page).toHaveURL(
          `${process.env.PUBLIC_BASE_URL}/checkout-step-one.html`
        );
      });
    });

    test("Validate that the user can proceed to fillout their shipping information", async () => {
      const shippingPage = new ShippingPage(page);

      await test.step("Fill shipping details", async () => {
        await shippingPage.fillShippingDetails(
          testData.valid_user.firstName,
          testData.valid_user.lastName,
          testData.valid_user.postalCode
        );
      });

      await test.step("Click the continue button and verify that the user is redirected to the overview page", async () => {
        await shippingPage.clickContinueButton();
        await expect(page).toHaveURL(
          `${process.env.PUBLIC_BASE_URL}/checkout-step-two.html`
        );
      });
    });

    test("Validate that the user can view their order summary", async () => {
      const checkoutPage = new CheckoutPage(page);

      await test.step("Verify cart content", async () => {
        await checkoutPage.verifyCartContent();
      });

      await test.step("Verify total price", async () => {
        await checkoutPage.verifyTotal();
      });

      await test.step("Click the finish button and verify that the user is redirected to the complete page", async () => {
        await checkoutPage.clickFinishButton();
        await expect(page).toHaveURL(
          `${process.env.PUBLIC_BASE_URL}/checkout-complete.html`
        );
      });
    });

    test("Validate that the user can view the complete page", async () => {
      await test.step("Verify that the user can view the complete page", async () => {
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.verifyConfirmationText();
      });
    });
  }
);

// test.describe.serial(
//   "View Cart and Proceed to checkout",
//   {
//     tag: "@PositiveTest",
//   },
//   () => {
//     let page;

//     test.beforeAll(async ({ browser }) => {
//       const context = await browser.newContext();
//       page = await context.newPage();
//       await page.goto("/");
//       const loginPage = new LoginPage(page);

//       const username = testData.valid_user.username;
//       const password = testData.valid_user.password;

//       await loginPage.login(username, password);
//     });

//   }
// );

test.describe.serial(
  "Negative Scenarios",
  {
    tag: "@NegativeTest",
  },
  () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
      await page.goto("/");
    });

    test("Validate that a user cannot login with invalid credentials", async () => {
      const loginPage = new LoginPage(page);

      const username = testData.invalid_user.username;
      const password = testData.invalid_user.password;

      await test.step("Login with invalid credentials", async () => {
        await loginPage.login(username, password);

        const errorMessageText = await loginPage.errorMessage();
        expect(errorMessageText).toContain(
          "Username and password do not match any user in this service"
        );
      });
    });

    test("Validate that the user cannot login with empty credentials", async () => {
      const loginPage = new LoginPage(page);

      await test.step("Login with empty credentials", async () => {
        await loginPage.login("", "");

        const errorMessageText = await loginPage.errorMessage();
        expect(errorMessageText).toContain("Username is required");
      });
    });

    test("Validate that the user cannot login with only username", async () => {
      const loginPage = new LoginPage(page);

      await test.step("Login with only username", async () => {
        await loginPage.login(testData.valid_user.username, "");

        const errorMessageText = await loginPage.errorMessage();
        expect(errorMessageText).toContain("Password is required");
      });
    });

    test("Validate that an authenticated user cannot access the product page directly from the URL", async () => {
      const loginPage = new LoginPage(page);
      await test.step("Access the product page directly from the URL", async () => {
        await page.goto(`${process.env.PUBLIC_BASE_URL}/inventory.html`);
        const errorMessageText = await loginPage.errorMessage();
        expect(errorMessageText).toContain(
          "You can only access '/inventory.html' when you are logged in."
        );
      });
    });

    test("Validate that a user with an empty cart cannot proceed to checkout", async () => {
      const productsPage = new Productspage(page);
      const loginPage = new LoginPage(page);
      const cartPage = new CartPage(page);

      await test.step("Login with valid credentials", async () => {
        const username = testData.valid_user.username;
        const password = testData.valid_user.password;
        await loginPage.login(username, password);
        await expect(page).toHaveTitle("Swag Labs");
      });

      await test.step("Click the cart button", async () => {
        await productsPage.goToCart();
        await expect(page).toHaveURL(
          `${process.env.PUBLIC_BASE_URL}/cart.html`
        );
      });

      await test.step("Click the checkout button", async () => {
        await cartPage.goToCheckout();
        expect
          .soft(page.url())
          .not.toContain(
            `${process.env.PUBLIC_BASE_URL}/checkout-step-one.html`,
            "Checkout should not be allowed with an empty cart!"
          );
      });
    });
  }
);

// test.describe.serial({
//   tag: "@PositiveTest"
// }, () => {

// })
