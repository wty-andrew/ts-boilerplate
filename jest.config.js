module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|glsl|vert|frag)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: "jsdom",
}
