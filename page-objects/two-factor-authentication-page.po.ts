import { type Locator, type Page } from "@playwright/test";

export class TwoFactorAuthenticationPage {
  readonly page: Page;
  readonly standardLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.standardLogin = page.getByTestId("custom-opt-out");
  }

  // select a standart login option
  async selectStandardLogin(page: Page) {
    await page.waitForSelector('[id="custom-opt-out"]', {
      state: "visible",
      timeout: 10000,
    });
    await this.standardLogin.click();
  }
}
