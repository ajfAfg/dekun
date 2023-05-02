import * as ts from "typescript";

const extractFromStatement = (
  statement: ts.Statement,
  definitionName: string,
  sourceFile: ts.SourceFile
): string | null => {
  const printer = ts.createPrinter({ removeComments: true });

  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations
      .map((declaration) => {
        const name = ts.isIdentifier(declaration.name)
          ? declaration.name.escapedText
          : null;
        if (name === definitionName) {
          return printer.printNode(
            ts.EmitHint.Unspecified,
            statement,
            sourceFile
          );
        } else {
          return null;
        }
      })
      .reduce((acc, x) => (x ? x : acc), null);
  } else if (ts.isFunctionDeclaration(statement)) {
    if (statement.name) {
      const name = ts.isIdentifier(statement.name)
        ? statement.name.escapedText
        : null;
      if (name === definitionName) {
        return printer.printNode(
          ts.EmitHint.Unspecified,
          statement,
          sourceFile
        );
      }
    }
  }

  return null;
};

export const extractFromString = (
  str: string,
  definitionName: string
): string | null => {
  const sourceFile = ts.createSourceFile(
    "dummy.ts",
    str,
    ts.ScriptTarget.Latest
  );

  return sourceFile.statements
    .map((statement) =>
      extractFromStatement(statement, definitionName, sourceFile)
    )
    .reduce((acc, x) => (x ? x : acc), null);
};

export const extract = (
  filename: string,
  definitionName: string
): string | null => {
  return extractFromString(ts.sys.readFile(filename) ?? "", definitionName);
};
