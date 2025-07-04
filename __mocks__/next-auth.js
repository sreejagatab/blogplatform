// Mock for next-auth
module.exports = {
  __esModule: true,
  default: jest.fn(),
  getServerSession: jest.fn(),
  NextAuth: jest.fn(),
}
