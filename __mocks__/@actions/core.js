// Mock implementation of @actions/core
module.exports = {
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  setSecret: jest.fn(),
  addPath: jest.fn(),
  exportVariable: jest.fn(),
  summary: {
    addRaw: jest.fn().mockReturnThis(),
    addEOL: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    write: jest.fn().mockResolvedValue(undefined)
  },
  notice: jest.fn(),
  group: jest.fn().mockImplementation((name, fn) => fn()),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  isDebug: jest.fn().mockReturnValue(false)
};
