/* global HTMLTemplateElement */

// Import the necessary helpers
import parseTemplateLiteral from "./util/parseTemplateLiteral.js";
import parseExpression from "./util/parseExpression.js";
import executeAST from "./util/executeAST.js";

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
						const ast = parseExpression(v);
						const value = executeAST(ast, {
							context,
							globalContext
						});
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
