import { OPERATORS, UNARY_OPERATORS } from "./operators.js";

// executes the AST code recursively
// eslint-disable-next-line jsdoc/require-jsdoc
export default function executeAST(ast, { context, globalContext, assign }) {
	globalContext = globalContext || context;
	let retval;
	if (ast.type === "CallExpression") {
		const obj = executeAST(ast.callee, { context, globalContext });
		const args = ast.arguments.map((arg) => executeAST(arg, { context, globalContext }));
		retval = obj.apply(undefined, args);
	} else if (ast.type === "MemberExpression") {
		const obj = executeAST(ast.object, { context, globalContext });
		const prop = executeAST(ast.property, { context: obj, globalContext, assign });
		if (!assign) {
			if (typeof prop === "function") {
				retval = prop.bind(obj);
			} else {
				if (ast.property.type === "Identifier") {
					retval = prop; // already resolved
				} else {
					retval = obj[prop];
				}
			}
		} else {
			obj[prop] = assign;
		}
	} else if (ast.type === "BinaryExpression") {
		const left = executeAST(ast.left, { context, globalContext });
		const right = executeAST(ast.right, { context, globalContext });
		retval = OPERATORS[ast.operator](left, right);
	} else if (ast.type === "UnaryExpression") {
		const arg = executeAST(ast.argument, { globalContext });
		retval = UNARY_OPERATORS[ast.operator](arg);
	} else if (ast.type === "Identifier") {
		if (!assign) {
			// Identifier can also be resolved from global context as fallback
			retval = context?.[ast.name] || globalContext?.[ast.name];
		} else {
			// for assignments we just return the name, not the value of the Identifier
			return ast.name;
		}
	} else if (ast.type === "Literal") {
		retval = ast.value;
	} else if (ast.type === "ConditionalExpression") {
		const test = executeAST(ast.test, { context, globalContext });
		if (test) {
			retval = executeAST(ast.consequent, { context, globalContext });
		} else {
			retval = executeAST(ast.alternate, { context, globalContext });
		}
	} else if (ast.type === "TemplateLiteral") {
		const strings = ast.quasis.map((q) => executeAST(q, { context, globalContext }));
		const values = ast.expressions.map((exp) => executeAST(exp, { context, globalContext }));
		retval = strings.reduce((accumulator, currentValue, currentIndex) => {
			return `${accumulator}${values[currentIndex - 1]}${currentValue}`;
		});
	} else if (ast.type === "TemplateElement") {
		retval = ast.value.cooked;
	} else if (ast.type === "TaggedTemplateExpression") {
		const tFn = executeAST(ast.tag, { context: globalContext, globalContext });
		const qs = ast.quasi.quasis.map((q) => executeAST(q, { context, globalContext }));
		qs.raw = [...qs]; // the quasis array requires a raw array as a copy
		const exps = ast.quasi.expressions.map((exp) => executeAST(exp, { context, globalContext }));
		retval = tFn(qs, ...exps);
		/* resolve lit-html manually! => NOT EXPECTED BEHAVIOR!
        const output = tFn(strings, ...values);
        retval = output.strings.reduce((accumulator, currentValue, currentIndex) => {
            return `${accumulator}\${${output.values[currentIndex - 1]}}${currentValue}`;
        });
        */
	} else if (ast.type === "ArrowFunctionExpression") {
		// NOT SUPPORTED>: "() => { ... }" --> detected as ObjectExpression
		if (ast.body.type === "ObjectExpression") {
			throw Error("Only ArrowFunctionExpressions are supported! Function bodies are not allowed!");
		}
		const params = ast.params?.map((param) => param.name) || [];
		// CSP compliant way to execute Arrow Function Expressions
		retval = (function (params, body) {
			return function () {
				// filter function arguments for params only
				const args = {};
				for (let i = 0; i < params.length; i++) {
					args[params[i]] = arguments[i];
				}
				const value = executeAST(body, { context: args, globalContext });
				return value;
			};
		})(params, ast.body);
	} else if (ast.type === "AssignmentExpression") {
		const right = executeAST(ast.right, { context, globalContext });
		executeAST(ast.left, { context, globalContext, assign: right });
	}
	return retval;
}
