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
import jsepPluginAssignment from "@jsep-plugin/assignment";
import jsepPluginObject from "@jsep-plugin/object";
import jsepPluginNumbers from "@jsep-plugin/numbers";
import jsepPluginArrow from "@jsep-plugin/arrow";
//import jsepPluginTemplate from "@jsep-plugin/template";
import jsepPluginTemplate from "../jsep-plugins/template.js";
import jsepPluginTernary from "@jsep-plugin/ternary";
import jsepPluginRegex from "@jsep-plugin/regex";
jsep.plugins.register(jsepPluginAssignment, jsepPluginObject, jsepPluginNumbers, jsepPluginArrow, jsepPluginTemplate, jsepPluginTernary, jsepPluginRegex);

// fixture for jsep to handle missing features:
// eslint-disable-next-line jsdoc/require-jsdoc
export default function parseExpression(v) {
	return jsep(v);
}
