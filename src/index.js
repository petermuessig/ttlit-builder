// Import the necessary helpers
import parseTemplateLiteral from "./util/parseTemplateLiteral";
import executeAST from "./util/executeAST";

// JSEP: https://ericsmekens.github.io/jsep/
//  - https://www.npmjs.com/package/jsep
import jsep from "jsep";

// Add additional plugins for jsep:
//  - https://www.npmjs.com/package/@jsep-plugin/assignment
//  - https://www.npmjs.com/package/@jsep-plugin/object
//  - https://www.npmjs.com/package/@jsep-plugin/numbers
//  - https://www.npmjs.com/package/@jsep-plugin/arrow
//  - https://www.npmjs.com/package/@jsep-plugin/template
//  - https://www.npmjs.com/package/@jsep-plugin/ternary
//  - https://www.npmjs.com/package/@jsep-plugin/regex
//  - https://www.npmjs.com/package/@jsep-plugin/new
//  - https://www.npmjs.com/package/@jsep-plugin/spread
//  - https://www.npmjs.com/package/@jsep-plugin/async-await
//  - https://www.npmjs.com/package/@jsep-plugin/comment
import jsepPluginAssignment from "@jsep-plugin/assignment";
import jsepPluginObject from "@jsep-plugin/object";
import jsepPluginNumbers from "@jsep-plugin/numbers";
import jsepPluginArrow from "@jsep-plugin/arrow";
import jsepPluginTemplate from "@jsep-plugin/template";
import jsepPluginTernary from "@jsep-plugin/ternary";
import jsepPluginRegex from "@jsep-plugin/regex";
import jsepPluginNew from "@jsep-plugin/new";
import jsepPluginSpread from "@jsep-plugin/spread";
import jsepPluginAsyncAwait from "@jsep-plugin/async-await";
import jsepPluginComment from "@jsep-plugin/comment";
jsep.plugins.register(
	jsepPluginAssignment,
	jsepPluginObject,
	jsepPluginNumbers,
	jsepPluginArrow,
	jsepPluginTemplate,
	jsepPluginTernary,
	jsepPluginRegex,
	jsepPluginNew,
	jsepPluginSpread,
	jsepPluginAsyncAwait,
	jsepPluginComment
);

/**
 * Injects the template string into the given tag function.
 * @param {Function} tagFn the template tag function (e.g. String.raw or html)
 * @param {string} string the template string
 * @returns {any} the output of the template tag function using the given template string
 */
export default function buildTemplate(tagFn, string) {
	const info = parseTemplateLiteral(string);
	return (ctx) => {
		return tagFn(
			info.strings,
			...info.values.map((v) => {
				try {
					const ast = jsep(v);
					const value = executeAST(ast, ctx);
					return value;
				} catch (ex) {
					// failed to parse the expression!
					throw new Error(`Error parsing: ${v}`, ex);
				}
			})
		);
	};
}
