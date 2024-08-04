require("dotenv").config();

import { test, expect } from "@playwright/test";
import MailSlurp from "mailslurp-client";

test.beforeEach("open base URL", async ({ page }) => {
  await page.goto("/");
});

test.describe("Auth tests", () => {
  // regex for "Your code is: 123456"
  const regex: RegExp = /Your code is:\s*(\d{6})/;

  // retrieve and validate the API key from .env
  const apiKey = process.env.API_KEY as string;
  expect(apiKey).toBeDefined();
  const mailslurp = new MailSlurp({ apiKey });

  test("should sign up successfully", async ({ page }) => {
    const password = "Test-Password-" + Date.now();
    const givenName = "Albina";
    const surname = "QA";

    // navigate to the sign up page
    await page.getByRole("button").click();
    await page.getByTestId("createAccount").click();

    // create a new inbox
    const { id, emailAddress } = await mailslurp.createInbox();

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
    await page.getByTestId("givenName").fill(givenName);
    await page.getByTestId("surname").fill(surname);

    // agree to the terms of use
    await page
      .getByTestId(
        "extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes"
      )
      .check();

    // submit
    await page.getByTestId("continue").click();

    // select a standart login option
    await page.waitForSelector('[id="custom-opt-out"]', {
      state: "visible",
      timeout: 10000,
    });
    await page.getByTestId("custom-opt-out").click();

    // verify that the profile page with the "Download Maltego" button is displayed
    await expect(page.getByText("Download Maltego")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should login and logout successfully", async ({ page }) => {
    // existing email
    const defaultEmail = "9650bb31-1538-4ebc-b387-47f92ae92f93@mailslurp.net";
    const defaultPassword = "Test-Password-123";

    // navigate to the login page
    await page.getByRole("button").click();

    // fill up the login fields
    await page.getByTestId("signInName").fill(defaultEmail);
    await page.getByTestId("password").fill(defaultPassword);

    // submit
    await page.getByTestId("next").click();

    // verify that the profile page with the "Download Maltego" button is displayed
    await expect(page.getByText("Download Maltego")).toBeVisible({
      timeout: 10000,
    });

    // logout
    await page.locator('[aria-controls="account-menu"]').click();
    await page.getByRole("menuitem").click();

    // verify that the welcome page is displayed
    await expect(page.getByText("Welcome")).toBeVisible();
  });

  test("should reset password and then login successfully", async ({
    page,
  }) => {
    // existing email
    const emailAddressID = "913cae6a-0027-4a69-8b8e-49d6b470c20f";
    const emailAddress = "913cae6a-0027-4a69-8b8e-49d6b470c20f@mailslurp.net";
    const newPassword = "Test-Password-NEW-" + Date.now();

    // navigate to the forgot password page
    await page.getByRole("button").click();
    await page.getByTestId("forgotPassword").click();

    // request a verification code
    await page.getByTestId("email").fill(emailAddress);
    await page.getByTestId("email_ver_but_send").click();

    // extract the verification code
    const email = await mailslurp.waitForLatestEmail(
      emailAddressID,
      30000,
      true
    );
    const emailBody = email.body ?? "";
    const match = regex.exec(emailBody) ?? "";
    const code: string = match[0].slice(-6);

    // enter the verification code
    await page.getByTestId("email_ver_input").fill(code);
    await page.getByTestId("email_ver_but_verify").click();

    // continue
    await page.getByTestId("continue").click();

    // enter a new password
    await page.getByTestId("newPassword").fill(newPassword);
    await page.getByTestId("reenterPassword").fill(newPassword);

    // continue
    await page.getByTestId("continue").click();

    // verify that the profile page with the "Download Maltego" button is displayed
    await expect(page.getByText("Download Maltego")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.afterAll("close browser after running tests", async ({ page }) => {
  await page.close();
});
