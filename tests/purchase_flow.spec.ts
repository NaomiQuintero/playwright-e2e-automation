import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import users from '../test-data/qa/Users.json';
import checkoutinfo from '../test-data/qa/CheckoutInfo.json'


test('User can complete a purchase successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const listOfProducts = ['Sauce Labs Backpack', 'Sauce Labs Onesie', 'Sauce Labs Bolt T-Shirt'];

    //Login
    await loginPage.navigate();
    await loginPage.userLogin(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/inventory/);

    //Add products and validate cart
    await inventoryPage.addMultipleProducts(listOfProducts);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart/);

    await expect(cartPage.getCartItems()).toHaveCount(listOfProducts.length);

    for (const product of listOfProducts) {
        await expect(cartPage.getCartItemByName(product)).toBeVisible();
    }

    //Checkout step one
    await checkoutPage.clickCheckout();

    await expect(page).toHaveURL(/checkout-step-one/);
    await checkoutPage.fillCheckoutInfo(checkoutinfo.firstname, checkoutinfo.lastname, checkoutinfo.zipcode);
    await checkoutPage.continueCheckout();

    //Checkout overview validation
    await expect(page).toHaveURL(/checkout-step-two/);
    for (const product of listOfProducts) {
        await expect(cartPage.getCartItemByName(product)).toBeVisible();
    }
    // Validate UI total matches sum of individual item prices
    const prices = await checkoutPage.getAllPrices();
    let calculatedTotal = 0;
    for (const price of prices) {
        calculatedTotal += price;
    }
    const totalText = await page.locator('.summary_subtotal_label').textContent();
    const totalPriceUI = parseFloat(totalText?.split('$')[1] || '0');

    expect(calculatedTotal).toBeCloseTo(totalPriceUI, 2);

    await checkoutPage.finishCheckout();

    //Complete order
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.getSuccessMessage()).toContainText('Thank you for your order!');
    await expect(checkoutPage.getCompleteText()).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');


});