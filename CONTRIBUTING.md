# Contributing

## Prequisites

This project uses [Node.js](https://nodejs.org) 12 to run ideally, although most recent Node.js versions should also work without issue.

This project uses [Yarn](https://yarnpkg.com) to install dependencies, although you can use another package manager like [npm](https://www.npmjs.com) or [pnpm](https://pnpm.js.org).

```sh
yarn install
# or  for npm
npm i
# or for pnpm
pnpm install
```

## Publishing

Publishing is automatically done with [semantic release](https://semantic-release.gitbook.io/semantic-release/).
Configure semantic release in the `./.releaserc.json` file.

## Building

Run the `build` script to compile the TypeScript into the `tsc_output` folder.

## Style

This project uses [Prettier](https://prettier.io) and [XO](https://github.com/xojs/xo).

You can run Prettier in the project with this command:

```sh
yarn run style
```

You can run XO with this command:

```sh
yarn run lint
```

Note that XO will also error if you have TypeScript errors, not just if your formatting is incorrect.

## Linting

This project uses [XO](https://github.com/xojs/xo) (which uses [ESLint](https://eslint.org) and some plugins internally) to perform static analysis on the TypeScript.
It reports things like unused variables or not following code conventions.

```sh
yarn run lint
```

Note that XO will also error if you have incorrect formatting, not just if your TypeScript code has errors.

## Testing

Unit tests are stored alongside regular files.
Ex. the file `index.ts` will have a corresponding test file called `index.test.ts` in the same directory.
You can run the tests with the `test` script:

```sh
yarn run test
```

### Coverage

This will generate a `coverage` folder which has a breakdown of coverage of the project.
The CI will upload the coverage information to [CodeCov](https://codecov.io) which can be [viewed here](https://codecov.io/gh/Discoin/scambio).
