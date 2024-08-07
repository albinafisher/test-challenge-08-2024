import { expect, type Locator, type Page } from "@playwright/test";

export class WelcomePage {
  readonly page: Page;
  readonly welcomeHeader: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeader = page.getByText("Welcome");
    this.loginButton = page.getByRole("button");
  }

  // navigate to the login page
  async goToLoginPage() {
    await this.loginButton.click();
  }

  // verify that the welcome page is displayed
  async verifyWelcomePage() {
    await expect(this.welcomeHeader).toBeVisible({
      timeout: 10000,
    });
  }
}
