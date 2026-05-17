import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '..',
  testMatch: ['<rootDir>/api/specs/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/api/setup.ts'],
  testTimeout: 10000,
  verbose: true,
};

export default config;
