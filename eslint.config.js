import globals from "globals";
import js from "@eslint/js";
import { jsdoc } from "eslint-plugin-jsdoc";

export default [
	js.configs.recommended,
	jsdoc({
		config: "flat/recommended"
	}),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				sap: "readonly",
				global: "readonly"
			},
			ecmaVersion: 2023,
			sourceType: "module"
		},
		rules: {
			"prefer-const": "warn"
		}
	},
	{
		ignores: ["node_modules/**", "dist/**", ".husky/**", "eslint.config.js", "rollup.config.js"]
	}
];
