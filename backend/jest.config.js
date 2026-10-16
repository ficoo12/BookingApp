module.exports = {
  testEnvironment: "node",
  // Strip TypeScript types before Jest runs a .ts file.
  transform: {
    "^.+\\.ts$": ["@swc/jest", { jsc: { parser: { syntax: "typescript" } } }],
  },
};
