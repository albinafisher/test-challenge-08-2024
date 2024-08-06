import { expect, type Locator, type Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly maltegoAdminHeader: Locator;
  readonly accountMenuBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.maltegoAdminHeader = page.getByText("Maltego Admin");
    this.accountMenuBtn = page.locator('[aria-controls="account-menu"]');
    this.logoutBtn = page.getByRole("menuitem");
  }

  // verify that the profile page with the "Maltego Admin" section is displayed
  async verifyProfilePage() {
    await expect(this.maltegoAdminHeader).toBeVisible({
      timeout: 60000,
    });
  }

  // logout
  async logout() {
    await this.accountMenuBtn.click();
    await this.logoutBtn.click();
  }
}
