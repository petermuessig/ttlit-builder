import { OPERATORS, UNARY_OPERATORS } from "./operators";

// executes the AST code recursively
// eslint-disable-next-line jsdoc/require-jsdoc
export default function executeAST(ast, ctx, ctxGlobal) {
	ctxGlobal = ctxGlobal || ctx;
	let retval;
	if (ast.type === "CallExpression") {
		const obj = executeAST(ast.callee, ctx, ctxGlobal);
		const args = ast.arguments.map((arg) => executeAST(arg, ctx, ctxGlobal));
		retval = obj.apply(undefined, args);
	} else if (ast.type === "MemberExpression") {
		const obj = executeAST(ast.object, ctx, ctxGlobal);
		const prop = executeAST(ast.property, obj, ctxGlobal);
		if (typeof prop === "function") {
			retval = prop.bind(obj);
		} else {
			if (ast.property.type === "Identifier") {
				retval = prop; // already resolved
			} else {
				retval = obj[prop];
			}
		}
	} else if (ast.type === "BinaryExpression") {
		const left = executeAST(ast.left, ctx, ctxGlobal);
		const right = executeAST(ast.right, ctx, ctxGlobal);
		retval = OPERATORS[ast.operator](left, right);
	} else if (ast.type === "UnaryExpression") {
		const arg = executeAST(ast.argument, undefined, ctxGlobal);
		retval = UNARY_OPERATORS[ast.operator](arg);
	} else if (ast.type === "Identifier") {
		// Identifier can also be resolved from global context as fallback
		retval = ctx[ast.name] || ctxGlobal[ast.name];
	} else if (ast.type === "Literal") {
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
				const value = executeAST(body, args, ctxGlobal);
				return value;
			};
		})(params, ast.body);
	}
	return retval;
}
