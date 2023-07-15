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

// parse the template strings and build the lit-html object
// eslint-disable-next-line jsdoc/require-jsdoc
function parseTemplateLiteral(s) {
	const info = {
		strings: [],
		values: []
	};
	let pos = 0,
		l = 0,
		dq = false,
		sq = false;
	for (let i = 0; i < s.length; ++i) {
		switch (s[i]) {
			case "$":
				if (!dq && !sq && l == 0 && s[i + 1] === "{") {
					if (i >= pos) {
						info.strings.push(s.substring(pos, i));
					}
					pos = i + 2;
				}
				break;
			case "{":
				if (!dq && !sq) {
					l++;
				}
				break;
			case "}":
				if (!dq && !sq && l > 0) {
					l--;
					if (l == 0) {
						info.values.push(s.substring(pos, i));
						pos = i + 1;
					}
				}
				break;
			case '"':
				if (l > 0 && !sq) {
					dq = !dq;
				}
				break;
			case "'":
				if (l > 0 && !dq) {
					sq = !sq;
				}
				break;
		}
	}
	info.strings.push(s.substr(pos, s.length /* - 1 <== seems to be wrong! */));
	info.strings.raw = [...info.strings];
	return info;
}

// operators
const OPERARATORS = {
	"+": function (l, r) {
		return l + r;
	},
	"-": function (l, r) {
		return l - r;
	},
	"*": function (l, r) {
		return l * r;
	},
	"/": function (l, r) {
		return l / r;
	},
	"%": function (l, r) {
		return l % r;
	},
	"<": function (l, r) {
		return l < r;
	},
	">": function (l, r) {
		return l > r;
	},
	"<=": function (l, r) {
		return l <= r;
	},
	">=": function (l, r) {
		return l >= r;
	},
	"&&": function (l, r) {
		return l && r;
	},
	"||": function (l, r) {
		return l || r;
	},
	"==": function (l, r) {
		return l == r;
	},
	"===": function (l, r) {
		return l === r;
	},
	"!=": function (l, r) {
		return l != r;
	},
	"!==": function (l, r) {
		return l !== r;
	},
	"!": function (a) {
		return !a;
	}
	// ...
};

// executes the AST code recursively
// eslint-disable-next-line jsdoc/require-jsdoc
function executeAST(ast, ctx, ctxGlobal) {
	ctxGlobal = ctxGlobal || ctx;
	let retval;
	if (ast.type === jsep.CALL_EXP) {
		const obj = executeAST(ast.callee, ctx, ctxGlobal);
		const args = ast.arguments.map((arg) => executeAST(arg, ctx, ctxGlobal));
		retval = obj.apply(undefined, args);
	} else if (ast.type === jsep.MEMBER_EXP) {
		const obj = executeAST(ast.object, ctx, ctxGlobal);
		const prop = executeAST(ast.property, obj, ctxGlobal);
		if (typeof prop === "function") {
			retval = prop.bind(obj);
		} else {
			if (ast.property.type === jsep.IDENTIFIER) {
				retval = prop; // already resolved
			} else {
				retval = obj[prop];
			}
		}
	} else if (ast.type === jsep.BINARY_EXP) {
		const left = executeAST(ast.left, ctx, ctxGlobal);
		const right = executeAST(ast.right, ctx, ctxGlobal);
		retval = OPERARATORS[ast.operator](left, right);
	} else if (ast.type === jsep.UNARY_EXP) {
		const arg = executeAST(ast.argument, undefined, ctxGlobal);
		retval = OPERARATORS[ast.operator](arg);
	} else if (ast.type === jsep.IDENTIFIER) {
		retval = ctx[ast.name];
	} else if (ast.type === jsep.LITERAL) {
		retval = ast.value;
	} else if (ast.type === "ConditionalExpression") {
		const test = executeAST(ast.test, ctx, ctxGlobal);
		if (test) {
			retval = executeAST(ast.consequent, ctx, ctxGlobal);
		} else {
			retval = executeAST(ast.alternate, ctx, ctxGlobal);
		}
	} else if (ast.type === "TemplateLiteral") {
		const strings = ast.quasis.map((q) => executeAST(q, ctx, ctxGlobal));
		const values = ast.expressions.map((exp) => executeAST(exp, ctx, ctxGlobal));
		retval = strings.reduce((accumulator, currentValue, currentIndex) => {
			return `${accumulator}${values[currentIndex - 1]}${currentValue}`;
		});
	} else if (ast.type === "TemplateElement") {
		retval = ast.value.cooked;
	} else if (ast.type === "TaggedTemplateExpression") {
		const tFn = executeAST(ast.tag, ctxGlobal); // needs to be looked up in global context
		const qs = ast.quasi.quasis.map((q) => executeAST(q, ctx, ctxGlobal));
		const exps = ast.quasi.expressions.map((exp) => executeAST(exp, ctx, ctxGlobal));
		if (ast.tag.name === "html") {
			// for lit-html we need to add the raw field
			qs.raw = [...qs];
		}
		retval = tFn(qs, ...exps);
		/* resolve lit-html manually! => NOT EXPECTED BEHAVIOR!
        const output = tFn(strings, ...values);
        retval = output.strings.reduce((accumulator, currentValue, currentIndex) => {
            return `${accumulator}\${${output.values[currentIndex - 1]}}${currentValue}`;
        });
        */
	} else if (ast.type === "ArrowFunctionExpression") {
		const params = ast.params.map((param) => param.name);
		// CSP compliant way to execute Arrow Function Expressions
		retval = (function (params, body) {
			return function () {
				// filter function arguments for params only
				const args = {};
				for (let i = 0; i < params.length; i++) {
					args[params[i]] = arguments[i];
				}
				const value = executeAST(body, args, ctxGlobal);
				return value;
			};
		})(params, ast.body);
	}
	return retval;
}

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
