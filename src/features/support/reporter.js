"use strict";
// features/support/reporter.ts (or similar)
Object.defineProperty(exports, "__esModule", { value: true });
const allure_js_commons_1 = require("allure-js-commons");
const allure_cucumberjs_1 = require("allure-cucumberjs");
class Reporter extends allure_cucumberjs_1.CucumberJSAllureFormatter {
    constructor(options) {
        super(options, new allure_js_commons_1.AllureRuntime({ resultsDir: "./allure-results" }), {});
    }
}
exports.default = Reporter;
