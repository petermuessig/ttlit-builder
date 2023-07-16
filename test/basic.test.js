import test from "ava";
import ttlit from "../src/index.js";

// no-op the HTMLTemplateElement
global.HTMLTemplateElement = function () {};

test("Basic test", (t) => {
	const ttFn1 = ttlit(String.raw, "Hello ${name}");
	t.is(ttFn1({ name: "World" }), "Hello World");
	const ttFn2 = ttlit(String.raw, "Hello ${name}");
	t.is(ttFn2(), "Hello undefined");
});

test("Basic test (with global context)", (t) => {
	const ttFn1 = ttlit(String.raw, "Hello ${name}");
	t.is(ttFn1({ name: "World" }, { name: "Universe" }), "Hello World");
	const ttFn2 = ttlit(String.raw, "Hello ${name}");
	t.is(ttFn2(undefined, { name: "Universe" }), "Hello Universe");
	const ttFn3 = ttlit(String.raw, "Hello ${name}, hello ${globalName}");
	t.is(ttFn3({ name: "World" }, { globalName: "Universe" }), "Hello World, hello Universe");
});

test("TaggedTemplateExpression", (t) => {
	const ttFn1 = ttlit(String.raw, "Hello ${`${name}`}");
	t.is(ttFn1({ name: "World" }), "Hello World");
	const ttFn2 = ttlit(String.raw, "Hello ${`XXX ` + (String.raw`${name}`)}");
	t.is(ttFn2({ name: "World" }, global), "Hello XXX World");
});

test("ArrowFunctionExpression", (t) => {
	const ttFnLocal = ttlit(String.raw, "Hello ${((name) => name)(name)}");
	t.is(ttFnLocal({ name: "Local" }, { name: "Global" }), "Hello Local");
	const ttFnGlobal = ttlit(String.raw, "Hello ${(() => name)()}");
	t.is(ttFnGlobal({ name: "Local" }, { name: "Global" }), "Hello Global");
});
