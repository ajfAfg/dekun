# dekun

A Library in TypeScript that provides functions to return an AST string of a specified variable definition or function definition from a specified file.

[本ライブラリを用いたテスト手法について書いた日本語の記事](https://zenn.dev/arjef/articles/snapshot-testing-for-function)

## Use case

Snapshot testing of function definitions. For example, it is used with [Jest](https://jestjs.io/) as follows.

Target

```ts
export const sum = (xs: [number]): number => xs.reduce((x, y) => x + y, 0);

function prod(xs: [number]): number {
  return xs.reduce((x, y) => x * y, 1);
}
```

Test

```ts
import { extract } from "@ajfafg/dekun";

describe("Demo", () => {
  it("sum", () => {
    expect(extract("src/foo.ts", "sum")).toMatchSnapshot();
  });
  it("prod", () => {
    expect(extract("src/foo.ts", "prod")).toMatchSnapshot();
  });
});
```

## Motivation

In some cases, such as wrapper functions, a function definition immediately shows that the function works as expected. In such cases, the function can be considered correct enough as long as it is ensured that **the function definition is not unintentionally modified**. As the concept of the testing pyramid suggests, testing should be done while considering cost-effectiveness, and I also believe that testing methods should be selected according to what we want to ensure. When the property to be ensured are simple, as in this case, I want to test more lightly than conventional testing methods such as sample-based testing.

## Approach

Perform snapshot testing of function definitions. Snapshot testing is a testing method used mainly on the front-end, and is mainly used to ensure that a UI is not modified unintentionally. Since what the snapshot testing does is similar to the `diff` command, this testing method can be used for non-UI testings as well. This approach is based on the idea of snapshot testing function definitions instead of UIs.

To obtain a function definition, the [AST (abstract syntax tree)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of the function definition is converted to a string. The most important reason for using AST is that I do not want to fail tests when the syntactic meaning does not change. For example, if we simply specify the number of lines in the file to obtain a string of function definitions, the test will fail simply because of the addition of comments, as shown below. This is undesirable from the standpoint of test reliability.

```ts
// before
const foo = (): number => 1;

// after
const foo = (): number => 1; // This is a comment
```

To realize this approach, the following two elements must be provided.

1. Test environment capable of snapshot testing
2. Function that takes a file name and a function name as arguments and returns the string of the AST of that function definition defined in the file

Jest will take care of 1, but 2 was not found as far as I could find. Therefore, I developed this library `dekun`, which is responsible for 2. By the way, the library name is derived from "Definition Extract 君".

## Current Specifications

- Supported Languages
  - TypeScript
- Referenceable variable/function definitions
  - Variables and functions defined at the top level of a file
  - It doesn't matter whether or not `export`
- Other detailed specifications
  - Refer to the first variable declaration/assignment for variables defined with `var` / `let`
    - i.e. `let foo = 1; foo = 2;` refers to `let foo = 1;`
  - If the specified variable is defined at the same time as other variables, all its variable definitions are referenced
    - For example, `foo` for `const foo = 1, bar = 2;` will refer to `const foo = 1, bar = 2;`
    - It is not easy to refer only to `const foo = 1`, but easy to refer only to `foo = 1`
    - If `const` information is missing, we can rewrite `const` to `var` and do anything, but the test will not fail, so I'm playing it safe this time
  - Even if two function definitions have the same syntactic meaning, the strings obtained using this library may differ
    - For example, the following two function definitions
    - To avoid this, this library adopt AST, but it has not been fully dealt with, which is a weak point of this library.
      - ~~That said, it is a problem that can be solved by using a strict formatter~~

```ts
// First
function foo() {
  return 1;
}

// Second
function foo() {
  return 1;
}
```

Currently, only minimal functionality is implemented in order to verity the acceptance of the "snapshot testing of function definitions" method in a PoC-like manner. I would appreciate your feedback to improve the functionality.

## LICENSE

MIT
