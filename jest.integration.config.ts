module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  testMatch: ["**/*.test.ts"],
  restoreMocks: true,
  clearMocks: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/config",
    "src/app.ts",
    "tests",
  ],
  coverageReporters: ["text", "lcov", "clover", "html"],
};
