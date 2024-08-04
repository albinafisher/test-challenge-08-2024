import { expect, type Locator, type Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly downloadMaltegoHeader: Locator;
  readonly accountMenuBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.downloadMaltegoHeader = page.getByText("Download Maltego");
    this.accountMenuBtn = page.locator('[aria-controls="account-menu"]');
    this.logoutBtn = page.getByRole("menuitem");
  }

  // verify that the profile page with the "Download Maltego" section is displayed
  async verifyProfilePage() {
    await expect(this.downloadMaltegoHeader).toBeVisible({
      timeout: 10000,
    });
  }

  // logout
  async logout() {
    await this.accountMenuBtn.click();
    await this.logoutBtn.click();
  }
}
