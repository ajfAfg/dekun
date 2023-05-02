import { extractFromString } from "../src";

describe("extractFromString", () => {
  it("The definition corresponding to the specified definition name is returned.", async () => {
    expect(extractFromString("const foo = 1;", "foo")).toBe("const foo = 1;");
    expect(extractFromString("const foo = 1, bar = 2;", "foo")).toBe(
      "const foo = 1, bar = 2;"
    );
    expect(extractFromString("function bar() { return 1; }", "bar")).toBe(
      "function bar() { return 1; }"
    );
  });

  it("If there is no definition corresponding to the specified definition name, null is returned.", async () => {
    expect(extractFromString("1;", "foo")).toBe(null);
    expect(extractFromString("", "foo")).toBe(null);
    expect(extractFromString("const foo = 1;", "bar")).toBe(null);
  });

  it("If the argument string is invalid according to the TypeScript syntax, null is returned.", async () => {
    expect(extractFromString('print_endline "OCaml is good."', "foo")).toBe(
      null
    );
  });

  it("Comments are deleted.", async () => {
    expect(extractFromString("const foo = 1; // bar baz", "foo")).toBe(
      "const foo = 1;"
    );
  });

  it("Lightly formatted.", async () => {
    expect(extractFromString("const  foo=1", "foo")).toBe("const foo = 1;");
    expect(
      extractFromString(
        `
        function bar() {
          return 1;
        }
        `,
        "bar"
      )
    ).not.toBe("function bar() { return 1; }");
  });
});
