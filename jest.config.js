module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.test.js"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
  ],
  verbose: true,
  // Add transformIgnorePatterns to handle node_modules properly
  transformIgnorePatterns: [
    "/node_modules/(?!@actions/)"
  ],
  // Set up moduleNameMapper for problematic modules
  moduleNameMapper: {
    "@actions/core": "<rootDir>/__mocks__/@actions/core.js"
  }
};
