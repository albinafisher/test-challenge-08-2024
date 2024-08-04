require("dotenv").config();

import { test, expect } from "@playwright/test";
import MailSlurp from "mailslurp-client";

test.beforeEach("open base URL", async ({ page }) => {
  await page.goto("/");
});

test.describe("Auth tests: ", () => {
  const password = "Test-Password-123";

  test("should sign up successfully", async ({ page }) => {
    // regex for "Your code is: 123456"
    const regex: RegExp = /Your code is:\s*(\d{6})/;

    // retrieve and validate the API key from .env
    const apiKey = process.env.API_KEY as string;
    expect(apiKey).toBeDefined();

    // create a new inbox
    const mailslurp = new MailSlurp({ apiKey });
    const { id, emailAddress } = await mailslurp.createInbox();

    // navigate to the sign up page
    await page.getByRole("button").click();
    await page.getByTestId("createAccount").click();

    // request a verification code
    await page.getByTestId("email").fill(emailAddress);
    await page.getByTestId("email_ver_but_send").click();

    // extract the verification code
    const email = await mailslurp.waitForLatestEmail(id);
    const emailBody = email.body ?? "";
    const match = regex.exec(emailBody) ?? "";
    const code: string = match[0].slice(-6);

    // enter the verification code
    await page.getByTestId("email_ver_input").fill(code);
    await page.getByTestId("email_ver_but_verify").click();

    // fill up the remaining fields
    await page.getByTestId("newPassword").fill(password);
    await page.getByTestId("reenterPassword").fill(password);
    await page.getByTestId("givenName").fill("Tester");
    await page.getByTestId("surname").fill("Maltego");

    // agree to the terms of use
    await page
      .getByTestId(
        "extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes"
      )
      .check();

    // submit
    await page.getByTestId("continue").click();

    // select a standart login option
    await expect(page.getByTestId("custom-opt-out")).toBeEnabled();
    await page.getByTestId("custom-opt-out").click();

    // verify that the profile page with the "Download Maltego" button is visible
    await expect(page.getByText("Download Maltego")).toBeVisible({
      timeout: 10000,
    });
  });
});
