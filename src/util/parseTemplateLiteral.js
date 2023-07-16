// parse the template strings and build the lit-html object
// eslint-disable-next-line jsdoc/require-jsdoc
export default function parseTemplateLiteral(s) {
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
