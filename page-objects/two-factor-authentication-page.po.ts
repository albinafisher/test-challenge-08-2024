import { expect, type Locator, type Page } from "@playwright/test";

export class TwoFactorAuthenticationPage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly standardLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('[class="form-title"]');
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

  // verify that the two-factor authentication page is displayed
  async verifyTwoFactorAuthenticationPage() {
    await expect(this.pageHeader).toHaveText("2 Factor Authentication?", {
      timeout: 10000,
    });
  }
}
