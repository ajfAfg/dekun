import { extract } from "@ajfafg/dekun";

describe("Demo", () => {
  it("sum", () => {
    expect(extract("src/foo.ts", "sum")).toMatchSnapshot();
  });
  it("prod", () => {
    expect(extract("src/foo.ts", "prod")).toMatchSnapshot();
  });
});
