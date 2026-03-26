import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import users from '../test-data/qa/Users.json';
import checkoutinfo from '../test-data/qa/CheckoutInfo.json'

test.describe('Checkout functionality', () => {
    const listOfProducts = ['Sauce Labs Backpack', 'Sauce Labs Onesie', 'Sauce Labs Bolt T-Shirt'];


    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        await loginPage.navigate();
        await loginPage.userLogin(users.validUser.username, users.validUser.password);
        await expect(page).toHaveURL(/inventory/);

        await inventoryPage.addMultipleProducts(listOfProducts);
        await inventoryPage.goToCart();

        await expect(page).toHaveURL(/cart/);

        await expect(cartPage.getCartItems()).toHaveCount(listOfProducts.length);

        for (const product of listOfProducts) {
            await expect(cartPage.getCartItemByName(product)).toBeVisible();
        }
    });

    test('User can successfully finish checkout', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
      

        await checkoutPage.clickCheckout();

        await expect(page).toHaveURL(/checkout-step-one/);
        await checkoutPage.fillCheckoutInfo(checkoutinfo.firstname, checkoutinfo.lastname, checkoutinfo.zipcode);
        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two/);
        for (const product of listOfProducts) {
            await expect(page.locator('.inventory_item_name', { hasText: product })).toBeVisible();
        };
        // Validate UI total matches sum of individual item prices
        const prices = await checkoutPage.getAllPrices();
        let calculatedTotal = 0;
        for (const price of prices){
            calculatedTotal += price;
        }
        const totalText = await page.locator('.summary_subtotal_label').textContent();
        const totalPriceUI = parseFloat(totalText?.split('$')[1] || '0');

        expect(calculatedTotal).toBeCloseTo(totalPriceUI, 2);

        await checkoutPage.finishCheckout();

        await expect(page).toHaveURL(/checkout-complete/);
        await expect(checkoutPage.getSuccessMessage()).toContainText('Thank you for your order!');
        await expect(checkoutPage.getCompleteText()).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

    });

    test('Validate error message when not fillin form', async ({ page }) => {

        const checkoutPage = new CheckoutPage(page);

        await page.click('[data-test="checkout"]');

        await expect(page).toHaveURL(/checkout-step-one/);

        await checkoutPage.continueCheckout();

        const error = checkoutPage.getErrorMessage();
        await expect(error).toBeVisible();
        await expect(error).toContainText('Error: First Name is required');
    });

});