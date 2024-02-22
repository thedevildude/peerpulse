module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  testMatch: ["**/*.spec.ts"],
  restoreMocks: true,
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/utils/singleton.ts"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/config",
    "src/app.ts",
    "tests",
  ],
  coverageReporters: ["text", "lcov", "clover", "html"],
};
