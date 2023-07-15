import resolve from "rollup-plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
	input: "src/index.js",
	output: [
		{
			name: "ttlit",
			file: "dist/builder.js",
			format: "iife"
		},
		{
			name: "ttlit",
			file: "dist/builder-min.js",
			format: "iife",
			plugins: [terser()]
		},
		{
			name: "ttlit",
			file: "dist/builder-umd.js",
			format: "umd"
		},
		{
			name: "ttlit",
			file: "dist/builder-umd-min.js",
			format: "umd",
			plugins: [terser()]
		},
		{
			name: "ttlit",
			file: "dist/builder-es.js",
			format: "es"
		},
		{
			name: "ttlit",
			file: "dist/builder-es-min.js",
			format: "es",
			plugins: [terser()]
		},
		{
			name: "ttlit",
			file: "dist/builder-cjs.js",
			format: "cjs"
		},
		{
			name: "ttlit",
			file: "dist/builder-cjs-min.js",
			format: "cjs",
			plugins: [terser()]
		},
		{
			name: "ttlit",
			file: "dist/builder-amd.js",
			format: "amd"
		},
		{
			name: "ttlit",
			file: "dist/builder-amd-min.js",
			format: "amd",
			plugins: [terser()]
		},
		{
			name: "ttlit",
			file: "dist/builder-ui5-dbg.js",
			format: "amd",
			amd: {
				define: "sap.ui.define"
			}
		},
		{
			name: "ttlit",
			file: "dist/builder-ui5.js",
			format: "amd",
			amd: {
				define: "sap.ui.define"
			},
			plugins: [terser()]
		}
	],
	plugins: [resolve()]
};
