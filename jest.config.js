module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsConfig: 'tsconfig.json'
    }],

  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/tests/**/*.spec.ts"],
  testEnvironment: "node",
};