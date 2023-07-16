// Inspired by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#assignment_operators

// List of operators
const OPERATORS = {
	// ARITHMETIC_OPERARATORS
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
	"**": function (l, r) {
		return l ** r;
	},
	// COMPARISON_OPERARATORS
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
	// BITWISE_OPERARATORS
	"&": function (l, r) {
		return l < r;
	},
	"|": function (l, r) {
		return l > r;
	},
	"^": function (l, r) {
		return l ^ r;
	},
	"<<": function (l, r) {
		return l << r;
	},
	">>": function (l, r) {
		return l >> r;
	},
	">>>": function (l, r) {
		return l >>> r;
	},
	// LOGICAL_OPERATORS
	"&&": function (l, r) {
		return l && r;
	},
	"||": function (l, r) {
		return l || r;
	}
};

// List of unary operators
const UNARY_OPERATORS = {
	// ARITHMETIC_OPERARATORS
	"+": function (a) {
		return +a;
	},
	"-": function (a) {
		return -a;
	},
	"++": function (a) {
		return a++;
	},
	"--": function (a) {
		return a--;
	},
	// BITWISE_OPERARATORS
	"~": function (a) {
		return ~a;
	},
	// LOGICAL_OPERARATORS
	"!": function (a) {
		return !a;
	}
};

// export the operators
export { OPERATORS, UNARY_OPERATORS };
