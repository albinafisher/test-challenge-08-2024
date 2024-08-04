import { type Locator, type Page } from "@playwright/test";
import MailSlurp from "mailslurp-client";

export class VerificationPage {
  readonly page: Page;
  readonly emailAddressInput: Locator;
  readonly sendVerificationCodeBtn: Locator;
  readonly verificationCodeInput: Locator;
  readonly verifyCodeBtn: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailAddressInput = page.getByTestId("email");
    this.sendVerificationCodeBtn = page.getByTestId("email_ver_but_send");
    this.verificationCodeInput = page.getByTestId("email_ver_input");
    this.verifyCodeBtn = page.getByTestId("email_ver_but_verify");
    this.continueBtn = page.getByTestId("continue");
  }

  // request a verification code
  async requestVerificationCode(emailAddress: string) {
    await this.emailAddressInput.fill(emailAddress);
    await this.sendVerificationCodeBtn.click();
  }

  // extract the verification code
  async extractVerificationCode(
    mailslurp: MailSlurp,
    emailAddressID: string
  ): Promise<string> {
    // regex for "Your code is: 123456"
    const regex: RegExp = /Your code is:\s*(\d{6})/;

    // extract the verification code from the latest email
    const email = await mailslurp.waitForLatestEmail(
      emailAddressID,
      30000,
      true
    );
    const emailBody = email.body ?? "";
    const match = regex.exec(emailBody) ?? "";
    const verificationCode: string = match[0].slice(-6);

    return verificationCode;
  }

  // enter the verification code
  async enterVerificationCode(verificationCode: string) {
    await this.verificationCodeInput.fill(verificationCode);
    await this.verifyCodeBtn.click();
  }

  // continue
  async continue() {
    await this.continueBtn.click();
  }
}
