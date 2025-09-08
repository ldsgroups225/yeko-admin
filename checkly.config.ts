import { defineConfig } from "checkly";
import { EmailAlertChannel, Frequency } from "checkly/constructs";

const sendDefaults = {
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: true,
};

const emailChannel = new EmailAlertChannel("email-channel-1", {
  address: process.env.CHECKLY_EMAIL_ADDRESS ?? "",
  ...sendDefaults,
});

export const config = defineConfig({
  projectName: process.env.CHECKLY_PROJECT_NAME ?? "yeko-admin",
  logicalId: process.env.CHECKLY_LOGICAL_ID ?? "yeko-admin-monitoring",
  repoUrl:
    process.env.GITHUB_REPOSITORY_URL ?? "https://github.com/yeko/yeko-admin",
  checks: {
    locations: ["us-east-1", "eu-west-1", "ap-southeast-1"],
    tags: ["yeko-admin"],
    runtimeId: "2024.02",
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: "**/tests/e2e/**/*.check.e2e.ts",
      alertChannels: [emailChannel],
    },
    playwrightConfig: {
      use: {
        baseURL: process.env.ENVIRONMENT_URL || process.env.NEXT_PUBLIC_APP_URL,
        extraHTTPHeaders: {
          "x-vercel-protection-bypass": process.env.VERCEL_BYPASS_TOKEN,
        },
      },
    },
  },
  cli: {
    runLocation: "us-east-1",
    reporters: ["list"],
  },
});

export default config;
