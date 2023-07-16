/* global HTMLTemplateElement */

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
 * Builds a template function out of the provided `string` or the innerHTML of the provided `HTMLTemplateElement`
 * which is executed using the given template tag function with the provided `context` and optionally an additional
 * `globalContext`.
 *
 * Usage example:
 * ```js
 * const ttFn = ttlit(String.raw, "Hello ${name}");
 * ttFn({ name: "World" }); // returns "Hello World"
 * ```
 * @param {Function} tagFn template tag function (e.g. `String.raw` or `html`)
 * @param {string|HTMLTemplateElement} stringOrHTMLTemplate template `string` or reference to a `HTMLTemplateElement`
 * @returns {function(object, [object]): any} `function` executing the template tag function with a given context and optionally a globalContext and returning its result
 */
export default function buildTemplateFunction(tagFn, stringOrHTMLTemplate) {
	let string = stringOrHTMLTemplate;
	if (string instanceof HTMLTemplateElement) {
		string = string.innerHTML.replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim();
	}
	if (typeof string === "string") {
		const info = parseTemplateLiteral(string);
		return (context, globalContext) => {
			return tagFn(
				info.strings,
				...info.values.map((v) => {
					try {
						const ast = jsep(v);
						const value = executeAST(ast, context, globalContext);
						return value;
					} catch (ex) {
						// failed to parse the expression!
						throw new Error(`Error parsing: ${v}\n${ex}`);
					}
				})
			);
		};
	} else {
		throw new Error(`The type of the parameter stringOrHTMLTemplate must be either string or HTMLTemplateElement!`);
	}
}
