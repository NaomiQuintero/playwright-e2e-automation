import { Page, expect } from "@playwright/test";

export class CheckoutPage {
    constructor(private page: Page) { }

    async clickCheckout() {
        await this.page.click('[data-test="checkout"]');
    }

    async fillCheckoutInfo(firstName: string, lastName: string, zipcode: string) {
        await this.page.fill('[data-test="firstName"]', firstName);
        await this.page.fill('[data-test="lastName"]', lastName);
        await this.page.fill('[data-test="postalCode"]', zipcode);
    }
    async continueCheckout() {
        await this.page.click('[data-test="continue"]');

    }
    async getAllPrices(): Promise<number[]> {
        const inventoryPrices = this.page.locator('.inventory_item_price');
        const countItems = await inventoryPrices.count();
        const prices: number[] = [];

        for (let i = 0; i < countItems; i++) {
            const textPrices = await inventoryPrices.nth(i).textContent();
            const convertedPrice = parseFloat(textPrices?.replace('$', '') || '0')
            prices.push(convertedPrice)
        }
        return prices;
    }
    async finishCheckout() {
        await this.page.click('[data-test="finish"]');

    }
    getSuccessMessage() {
        return this.page.locator('[data-test="complete-header"]');

    }
    getCompleteText() {
        return this.page.locator('[data-test="complete-text"]');
    }

    getErrorMessage() {
        return this.page.locator('[data-test="error"]');
    }

}


