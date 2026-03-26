import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
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

        const product = 'Sauce Labs Backpack';

        await inventoryPage.addProductToCart(product);
        await expect(inventoryPage.getCartBadge()).toHaveText('1');
        await inventoryPage.goToCart();

        await expect(page).toHaveURL(/cart/);

        await expect(cartPage.getCartItemByName('Sauce Labs Backpack')).toBeVisible();

    });

    test('Validate adding multiple items to cart', async ({ page }) => {

        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const listOfProducts = ['Sauce Labs Backpack', 'Sauce Labs Onesie', 'Sauce Labs Bolt T-Shirt'];

        await inventoryPage.addMultipleProducts(listOfProducts);
        await expect(inventoryPage.getCartBadge()).toHaveText(String(listOfProducts.length));
        await inventoryPage.goToCart();

        await expect(page).toHaveURL(/cart/);

        expect(await cartPage.getCartItems()).toHaveCount(listOfProducts.length);

        for (const product of listOfProducts) {
            await expect(cartPage.getCartItemByName(product)).toBeVisible();
        }

    });

    test('User can remove product from cart', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        const product = 'Sauce Labs Backpack';

        await inventoryPage.addProductToCart(product);
        await inventoryPage.goToCart();

        await expect(cartPage.getCartItemByName(product)).toBeVisible();

        await cartPage.removeProduct(product).click();

        await expect(cartPage.getCartItemByName(product)).toHaveCount(0);
    });

});