/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';


// Read tsconfig.json

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/singleton.ts'],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Transform configuration
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      useESM: true, // Set to false for CommonJS compatibility
      tsconfig: {
        module: 'ESNext', // Override the module setting for tests
        target: 'ESNext'
      }
    }],
  },
  // Module name mapping using pathsToModuleNameMapper
    moduleNameMapper: {
      '^@utils/(.*)$': '<rootDir>/utils/$1',
      '^@services$': '<rootDir>/services/index',
      '^@redis$': '<rootDir>/db/redis',
      '^@prisma_client$': '<rootDir>/db/prisma',
      '^@routes$': '<rootDir>/routes/index',
      '^@types$': '<rootDir>/types/index',
      '^@dto$': '<rootDir>/dto/index',
      '^@error/(.*)$': '<rootDir>/error/$1',
      '^@mappers$': '<rootDir>/mappers/index',
      '^@controllers$': '<rootDir>/controllers/index',
      '^@middlewares$': '<rootDir>/middlewares/index',
      '^@schemas$': '<rootDir>/schemas/index',
      '^@cron$': '<rootDir>/cron/jobs',
  },

  // Test match patterns
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts"
  ],

  // Transform ignore patterns - don't transform node_modules except for ESM modules
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$))"
  ],
  

  // Globals for ts-jest (alternative syntax)
  globals: {
    'ts-jest': {
      useESM: false,
      tsconfig: {
        module: 'CommonJS',
        target: 'ES2020'
      }
    }
  }
};

export default config;