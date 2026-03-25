import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPAge';
import { CartPage } from '../src/pages/CartPage';
import users from '../test-data/qa/Users.json'

test.describe('Cart functionality', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.userLogin(users.validUser.username, users.validUser.password);
        await expect(page).toHaveURL(/inventory/);
    });

    test('Validate adding an item to cart', async ({ page }) => {

        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);


        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();

        await expect(page).toHaveURL(/cart/);

        await expect(cartPage.getCartItemByName('Sauce Labs Backpack')).toBeVisible();

    });

    test('Validate adding multiple items to cart', async ({ page }) => {

        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const listOfProducts = ['Sauce Labs Backpack', 'Sauce Labs Onesie', 'Sauce Labs Bolt T-Shirt'];

        await inventoryPage.addMultipleProducts(listOfProducts);
        await inventoryPage.goToCart();
       
        await expect(page).toHaveURL(/cart/);

        expect(await cartPage.getCartItems()).toHaveCount(listOfProducts.length);

        for (const product of listOfProducts) {
            await expect(cartPage.getCartItemByName(product)).toBeVisible();
        }

    });

});