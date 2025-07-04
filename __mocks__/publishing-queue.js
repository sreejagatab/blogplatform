// Mock for publishing-queue
const mockPublishingQueue = {
  addToQueue: jest.fn().mockResolvedValue({
    success: true,
    jobIds: ['mock-job-1', 'mock-job-2'],
  }),
  processQueue: jest.fn().mockResolvedValue(undefined),
  startProcessing: jest.fn(),
  stopProcessing: jest.fn(),
  getQueueStatus: jest.fn().mockReturnValue({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  }),
}

module.exports = {
  PublishingQueue: jest.fn(() => mockPublishingQueue),
  publishingQueue: mockPublishingQueue,
}
