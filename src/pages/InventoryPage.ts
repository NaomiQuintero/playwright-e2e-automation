import { Page } from "@playwright/test";


export class InventoryPage {
    constructor(private page: Page) { }

    async getProduct(productName: string) {
          return this.page.locator('.inventory_item', {
      hasText: productName
        });
    }

    async addProductToCart(productName: string) {
        const product = await this.getProduct(productName);
        await product.locator('button').click();
    }

    async addMultipleProducts(products: string[]) {
        for (const product of products) {
            await this.addProductToCart(product);
        }
    }

    getCartBadge() {
        return this.page.locator('.shopping_cart_badge');
    }

    async goToCart() {
        await this.page.click('[data-test="shopping-cart-link"]')
    }
}