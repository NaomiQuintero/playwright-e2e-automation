import { Page, Locator } from "@playwright/test";

export class CartPage {
    constructor(private page: Page) { }

    getCartItems(): Locator {
        return this.page.locator('[data-test="inventory-item-name"]');
    }


    getCartItemByName(productName: string): Locator {
        return this.page.locator('[data-test="inventory-item-name"]', {
            hasText: productName
        });
    }

    removeProduct(productName: string) {
        const product = this.page.locator('.cart_item', {
            hasText: productName
        });

        return product.locator('button');
    }
}
