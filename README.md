# `ttlit-builder`

The *T*agged *T*emplate *Lit*erals _Builder_ (a.k.a. `ttlit-builder`) can be used to create tagged template literal functions dynamically using an existing tagged template (e.g. `String.raw` or `html`) by passing a template as `String`.

```js
const ttFn = ttlit(String.raw, "Hello ${name}");
ttFn({ name: "World" }); // returns "Hello World"
```

The template string can also include JavaScript expressions using other tagged template literals or arrow functions which will parsed and evaluated. Therefore, the module uses [`jsep`](https://ericsmekens.github.io/jsep/) - a tiny and extensible JavaScript expression parser - with the plugins: [assignment](https://www.npmjs.com/package/@jsep-plugin/), [object](https://www.npmjs.com/package/@jsep-plugin/object), [numbers](https://www.npmjs.com/package/@jsep-plugin/numbers), [arrow](https://www.npmjs.com/package/@jsep-plugin/arrow), [template](https://www.npmjs.com/package/@jsep-plugin/template), [ternary](https://www.npmjs.com/package/@jsep-plugin/ternary), [regex](https://www.npmjs.com/package/@jsep-plugin/regex), [new](https://www.npmjs.com/package/@jsep-plugin/new), [spread](https://www.npmjs.com/package/@jsep-plugin/spread), [async-await](https://www.npmjs.com/package/@jsep-plugin/async-await), and [comment](https://www.npmjs.com/package/@jsep-plugin/comment).

> :warning: The project is still in experimental phase! The API and extensibility of the package are subject to be changed in future releases!

## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.

## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this generator equally.

## License

This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the LICENSE file.
