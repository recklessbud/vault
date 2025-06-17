export default{
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/services/'],
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js', "json"],
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    watchPathIgnorePatterns: ['node_modules', '<rootDir>/src/services'], 
    collectCoverage: true, // Enable code coverage
    coverageDirectory: 'coverage', // Directory to store coverage reports
    coverageReporters: ['text', 'lcov'], // Types of coverage reports
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Support path aliases
    }

}