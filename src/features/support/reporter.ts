// features/support/reporter.ts (or similar)

import { AllureRuntime } from "allure-js-commons";
import { CucumberJSAllureFormatter } from "allure-cucumberjs";

export default class Reporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    super(
      options,
      new AllureRuntime({ resultsDir: "./allure-results" }),
      {}
    );
  }
}